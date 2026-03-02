'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  items: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('session_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Ordine non trovato');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('pwa_orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError) {
          setError('Impossibile caricare i dettagli');
          return;
        }

        setOrder(data as Order);
      } catch (err) {
        console.error('Error:', err);
        setError('Errore nel caricamento');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🚀 Dloop
            </Link>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Caricamento...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🚀 Dloop
            </Link>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold mb-4">⚠️ {error || 'Ordine non trovato'}</p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              ← Torna a Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Pagamento Confermato!
          </h1>

          <p className="text-gray-600 text-lg mb-2">
            Il tuo ordine è stato creato con successo
          </p>

          <p className="text-gray-500 text-sm mb-6">
            Riceverai presto un messaggio WhatsApp con i dettagli
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-600 mb-1">ID Ordine</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {orderId}
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Pagamento elaborato con Stripe</p>
            <p>✓ Conferma inviata a {order.customer_phone}</p>
            <p>✓ Tracciamento disponibile tra 1-2 minuti</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Dettagli Ordine</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">Nome Cliente</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_name}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">📱 Numero Telefono</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_phone}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">📍 Indirizzo</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_address}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">🛍️ Articoli</p>
              <p className="text-lg font-semibold text-gray-900">{order.items}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">💰 Importo Pagato</p>
              <p className="text-2xl font-bold text-green-600">€{order.total_price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href={`/order/${orderId}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-center">
            📍 Traccia Ordine
          </Link>
          <Link href="/catalog" className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition text-center">
            🛍️ Continua Shopping
          </Link>
          <Link href="/" className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold py-2">
            ← Torna a Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
          <p>💬 Hai domande?</p>
          <p>Contattaci su WhatsApp al <strong>+39 328 1854639</strong></p>
        </div>
      </div>
    </main>
  );
}
