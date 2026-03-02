// app/api/webhooks/stripe/route.ts
// Handles Stripe webhook events (payment success, failure, etc.)

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-10',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook processing failed: ${message}` },
      { status: 500 }
    );
  }
}

// ── Event Handlers ──

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.warn('No orderId in checkout session metadata');
    return;
  }

  console.log(`Payment completed for order ${orderId}`);

  // Update order status to PAID
  const { error } = await supabase
    .from('pwa_orders')
    .update({
      payment_status: 'PAID',
      stripe_session_id: session.id,
      paid_at: new Date().toISOString(),
      status: 'PAYMENT_CONFIRMED', // Ready for rider assignment
    })
    .eq('id', orderId);

  if (error) {
    console.error(`Failed to update order ${orderId}:`, error);
  } else {
    console.log(`Order ${orderId} marked as PAID`);

    // Optional: Send WhatsApp confirmation to customer
    try {
      await notifyCustomerPaymentSuccess(orderId, session.metadata?.customerPhone);
    } catch (notifyError) {
      console.error('Failed to send payment confirmation notification:', notifyError);
    }
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    console.warn('No orderId in payment intent metadata');
    return;
  }

  console.log(`Payment intent succeeded for order ${orderId}`);

  // Update order if not already updated by checkout session
  const { error } = await supabase
    .from('pwa_orders')
    .update({
      payment_status: 'PAID',
      stripe_payment_intent_id: paymentIntent.id,
      paid_at: new Date().toISOString(),
      status: 'PAYMENT_CONFIRMED',
    })
    .eq('id', orderId)
    .eq('payment_status', 'PENDING'); // Only update if still pending

  if (error) {
    console.error(`Failed to update order ${orderId}:`, error);
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
) {
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    console.warn('No orderId in payment intent metadata');
    return;
  }

  console.error(`Payment intent failed for order ${orderId}`);

  // Update order status to FAILED
  const { error } = await supabase
    .from('pwa_orders')
    .update({
      payment_status: 'FAILED',
      stripe_payment_intent_id: paymentIntent.id,
      status: 'PAYMENT_FAILED',
    })
    .eq('id', orderId);

  if (error) {
    console.error(`Failed to update order ${orderId}:`, error);
  }

  // Optional: Send failure notification
  try {
    await notifyCustomerPaymentFailed(orderId);
  } catch (notifyError) {
    console.error('Failed to send payment failure notification:', notifyError);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const orderId = charge.metadata?.orderId;

  if (!orderId) {
    console.warn('No orderId in charge metadata');
    return;
  }

  console.log(`Charge refunded for order ${orderId}`);

  // Update order status
  const { error } = await supabase
    .from('pwa_orders')
    .update({
      status: 'REFUNDED',
      payment_status: 'FAILED',
    })
    .eq('id', orderId);

  if (error) {
    console.error(`Failed to update order ${orderId}:`, error);
  }
}

// ── Notification Helpers ──

async function notifyCustomerPaymentSuccess(
  orderId: string,
  customerPhone?: string
) {
  if (!customerPhone) return;

  // Call Supabase Edge Function to send WhatsApp notification
  try {
    await supabase.functions.invoke('whatsapp-notify', {
      body: {
        customerPhone,
        orderId,
        messageType: 'PAYMENT_SUCCESS',
        trackingUrl: `https://dloop.vercel.app/order/${orderId}`,
      },
    });
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
  }
}

async function notifyCustomerPaymentFailed(orderId: string) {
  // Get order details
  const { data: order } = await supabase
    .from('pwa_orders')
    .select('customer_phone')
    .eq('id', orderId)
    .single();

  if (!order?.customer_phone) return;

  try {
    await supabase.functions.invoke('whatsapp-notify', {
      body: {
        customerPhone: order.customer_phone,
        orderId,
        messageType: 'PAYMENT_FAILED',
        retryUrl: `https://dloop.vercel.app/order/${orderId}`,
      },
    });
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
  }
}
