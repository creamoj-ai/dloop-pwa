// app/api/checkout/confirm-payment/route.ts
// Confirms payment intent for card-based payment

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

interface ConfirmPaymentRequest {
  orderId: string;
  paymentMethodId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmPaymentRequest = await request.json();
    const { orderId, paymentMethodId, amount } = body;

    if (!orderId || !paymentMethodId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        orderId,
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://dloop.vercel.app'}/success?payment_intent=${orderId}`,
    });

    // Check if payment requires action (3D Secure)
    if (paymentIntent.status === 'requires_action') {
      return NextResponse.json(
        {
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
        },
        { status: 200 }
      );
    }

    // Payment succeeded
    if (paymentIntent.status === 'succeeded') {
      // Update order with payment success
      const { error: updateError } = await supabase
        .from('pwa_orders')
        .update({
          payment_status: 'PAID',
          stripe_payment_intent_id: paymentIntent.id,
          paid_at: new Date().toISOString(),
          status: 'PAYMENT_CONFIRMED', // Ready for rider assignment
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order after payment:', updateError);
      }

      return NextResponse.json(
        {
          success: true,
          paymentIntentId: paymentIntent.id,
        },
        { status: 200 }
      );
    }

    // Payment failed
    if (paymentIntent.status === 'requires_payment_method') {
      return NextResponse.json(
        {
          error: 'Payment failed. Please try again.',
          requiresAction: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Unexpected payment status',
        status: paymentIntent.status,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment confirmation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: `Payment confirmation failed: ${message}`,
      },
      { status: 500 }
    );
  }
}
