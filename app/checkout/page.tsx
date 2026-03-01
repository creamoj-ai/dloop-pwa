'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🚀 Dloop
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">Il carrello è vuoto</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Torna al Catalogo
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name || !formData.phone || !formData.address) {
        throw new Error('Per favore compila tutti i campi obbligatori');
      }

      console.log('Creating order with data:', formData);

      // Create single order with all items in market_orders table
      const itemsStr = cart.items
        .map((item) => `${item.name} (x${item.quantity})`)
        .join(', ');

      const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Use market_orders table (no RLS restrictions for testing)
      const { data, error: err } = await supabase
        .from('market_orders')
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address,
            items: itemsStr,
            total_price: totalPrice,
            status: 'PENDING',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (err) throw err;
      if (!data || !data[0]) {
        throw new Error('Errore nella creazione dell\'ordine');
      }

      const orderId = data[0].id;
      console.log('Order created:', orderId);

      // Save customer phone for order history tracking
      localStorage.setItem('dloop_customer_phone', formData.phone);
      localStorage.setItem('dloop_customer_name', formData.name);

      // Send WhatsApp notification (async - don't block checkout)
      try {
        const { error: notifyError } = await supabase.functions.invoke(
          'whatsapp-notify',
          {
            body: {
              customerPhone: formData.phone,
              customerName: formData.name,
              orderId: orderId,
              totalPrice: totalPrice,
              items: itemsStr,
            },
          }
        );

        if (notifyError) {
          console.error('WhatsApp notification failed:', notifyError);
          // Don't block checkout if WhatsApp fails
        } else {
          console.log('WhatsApp notification sent successfully');
        }
      } catch (notifyErr) {
        console.error('WhatsApp notification error:', notifyErr);
        // Silent fail - order was created successfully
      }

      // Clear cart
      cart.clearCart();

      // Redirect to order tracking page
      router.push(`/order/${orderId}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.message || 'Errore nella creazione dell\'ordine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dettagli Consegna
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Es. Mario Rossi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numero Telefono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Es. +39 123 456 7890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indirizzo Consegna *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Es. Via Roma 123, 80100 Napoli"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Opzionale)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Es. Suonare il campanello 3 volte"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition mt-6"
                >
                  {loading ? 'Creazione in corso...' : '✅ CREA ORDINE'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Riepilogo Ordine
              </h2>

              {/* Items */}
              <div className="space-y-3 border-b border-gray-200 pb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 my-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Articoli:</span>
                  <span className="font-semibold">
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Totale items:</span>
                  <span className="font-semibold">€{cart.total().toFixed(2)}</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">TOTALE:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{cart.total().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Back Button */}
              <Link
                href="/cart"
                className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold py-2 mt-4"
              >
                ← Modifica Carrello
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
