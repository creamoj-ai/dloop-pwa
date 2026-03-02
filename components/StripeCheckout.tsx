'use client';

import { useState } from 'react';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: number;
  itemsDescription: string;
  onPaymentSuccess?: (sessionId: string) => void;
  onPaymentError?: (error: string) => void;
}

export function StripeCheckout({
  orderId,
  customerName,
  customerPhone,
  customerAddress,
  totalPrice,
  itemsDescription,
  onPaymentSuccess,
  onPaymentError,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our API endpoint to create a Stripe Checkout Session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerName,
          customerPhone,
          customerAddress,
          totalPrice,
          itemsDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Caricamento pagamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

// ── Alternative: Simple Stripe Elements Form ──
// Use this if you want a lighter form without Embedded Checkout

import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import React from 'react';

interface StripeElementsFormProps {
  orderId: string;
  totalPrice: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function StripeElementsForm({
  orderId,
  totalPrice,
  onSuccess,
  onError,
}: StripeElementsFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Create payment method from card element
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement)!,
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Call backend to confirm payment
      const response = await fetch('/api/checkout/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethodId: paymentMethod.id,
          amount: Math.round(totalPrice * 100),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const result = await response.json();

      // Handle 3D Secure or other authentication if needed
      if (result.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          result.clientSecret
        );
        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {isProcessing ? 'Elaborazione...' : `Paga €${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
}

export function StripeElementsWrapper(props: StripeElementsFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripeElementsForm {...props} />
    </Elements>
  );
}
