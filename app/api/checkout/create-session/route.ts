// app/api/checkout/create-session/route.ts
// Creates a Stripe Checkout Session for embedded checkout

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

interface CreateSessionRequest {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: number;
  itemsDescription: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSessionRequest = await request.json();
    const {
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      totalPrice,
      itemsDescription,
    } = body;

    // Validate required fields
    if (!orderId || !totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerPhone, // Use phone as identifier (no email yet)
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'DLOOP Order',
              description: itemsDescription,
              images: ['https://dloop.vercel.app/logo.png'], // Optional: add logo
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        customerName,
        customerPhone,
        customerAddress,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://dloop.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://dloop.vercel.app'}/order/${orderId}`,
    });

    // Update pwa_orders with session info
    const { error: updateError } = await supabase
      .from('pwa_orders')
      .update({
        stripe_session_id: session.id,
        payment_status: 'SENT',
        payment_sent_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with session:', updateError);
    }

    return NextResponse.json(
      {
        clientSecret: session.client_secret,
        sessionId: session.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe session creation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: `Failed to create checkout session: ${message}`,
      },
      { status: 500 }
    );
  }
}
