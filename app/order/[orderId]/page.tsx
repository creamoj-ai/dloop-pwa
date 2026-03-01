'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, Order, Rider } from '@/lib/supabase';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [rider, setRider] = useState<Rider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── FETCH INITIAL ORDER DATA ──
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError) {
          setError('Ordine non trovato');
          return;
        }

        setOrder(data as Order);

        // Fetch rider info if order is assigned
        if (data.assigned_rider_id) {
          const { data: riderData } = await supabase
            .from('riders')
            .select('*')
            .eq('id', data.assigned_rider_id)
            .single();

          if (riderData) {
            setRider(riderData as Rider);
          }
        }
      } catch (err) {
        setError('Errore nel caricamento dell\'ordine');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // ── REAL-TIME SUBSCRIPTION ──
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase.channel(`orders:${orderId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrder(updatedOrder);

          // Fetch rider info if newly assigned
          if (updatedOrder.assigned_rider_id && !rider) {
            (async () => {
              const { data: riderData } = await supabase
                .from('riders')
                .select('*')
                .eq('id', updatedOrder.assigned_rider_id)
                .single();

              if (riderData) {
                setRider(riderData as Rider);
              }
            })();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderId, rider]);

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
          <div className="text-center">
            <p className="text-gray-600">Caricamento ordine...</p>
          </div>
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
            <p className="text-red-600 font-semibold">{error || 'Ordine non trovato'}</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              ← Torna a Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── STATUS TIMELINE ──
  const statusSteps = [
    { status: 'PENDING', label: '📦 Ordine Confermato', icon: '📦' },
    { status: 'ASSIGNED', label: '🚗 Rider Assegnato', icon: '🚗' },
    { status: 'IN_PICKUP', label: '🏪 Ritiro in corso', icon: '🏪' },
    { status: 'IN_DELIVERY', label: '🚚 In consegna', icon: '🚚' },
    { status: 'DELIVERED', label: '✅ Consegnato', icon: '✅' },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📍 Tracciamento Ordine
          </h1>
          <p className="text-gray-600 font-mono text-sm">
            ID: {order.id.substring(0, 12)}...
          </p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Stato Ordine</h2>

          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrentStep = step.status === order.status;

              return (
                <div key={step.status} className="flex items-center space-x-4">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg flex-shrink-0 ${
                      isActive
                        ? isCurrentStep
                          ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200 animate-pulse'
                          : 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Label */}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.status === 'ASSIGNED' && order.assigned_at && (
                      <p className="text-xs text-gray-500">
                        {new Date(order.assigned_at).toLocaleTimeString('it-IT')}
                      </p>
                    )}
                    {step.status === 'IN_DELIVERY' && order.delivery_started_at && (
                      <p className="text-xs text-gray-500">
                        {new Date(order.delivery_started_at).toLocaleTimeString('it-IT')}
                      </p>
                    )}
                    {step.status === 'DELIVERED' && order.delivered_at && (
                      <p className="text-xs text-gray-500">
                        {new Date(order.delivered_at).toLocaleTimeString('it-IT')}
                      </p>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-[23px] w-1 h-12 -bottom-8 ${
                        isActive ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      style={{ transform: 'translateY(48px)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dettagli Ordine</h2>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600">Nome Cliente</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_name}</p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-600">📍 Indirizzo di Consegna</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_address}</p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-600">📱 Telefono</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_phone}</p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-600">🛍️ Prodotti</p>
              <p className="text-lg font-semibold text-gray-900">{order.items}</p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-600">💰 Totale</p>
              <p className="text-2xl font-bold text-blue-600">€{order.total_price.toFixed(2)}</p>
            </div>

            {order.estimated_arrival && (
              <div>
                <p className="text-sm text-gray-600">⏱️ ETA Consegna</p>
                <p className="text-lg font-semibold text-gray-900">{order.estimated_arrival}</p>
              </div>
            )}
          </div>
        </div>

        {/* Rider Info (when assigned) */}
        {rider && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Il Tuo Rider</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Nome</p>
                <p className="font-semibold text-gray-900">{rider.name}</p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-600">Valutazione</p>
                <p className="font-semibold text-yellow-500">⭐ {rider.rating.toFixed(1)}/5</p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-gray-600">📞 Telefono</p>
                <a
                  href={`tel:${rider.phone}`}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Chiama Rider
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/catalog"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-center"
          >
            🛍️ Continua lo Shopping
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold py-2"
          >
            ← Torna a Home
          </Link>
        </div>

        {/* Status Message */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          {order.status === 'PENDING' && (
            <p className="text-blue-700">⏳ In attesa di un rider disponibile...</p>
          )}
          {order.status === 'ASSIGNED' && (
            <p className="text-blue-700">🚗 Un rider ha accettato il tuo ordine!</p>
          )}
          {order.status === 'IN_PICKUP' && (
            <p className="text-blue-700">🏪 Il rider sta ritirando i tuoi prodotti...</p>
          )}
          {order.status === 'IN_DELIVERY' && (
            <p className="text-blue-700">🚚 Il rider è in viaggio verso di te!</p>
          )}
          {order.status === 'DELIVERED' && (
            <p className="text-green-700">✅ Ordine consegnato con successo!</p>
          )}
        </div>
      </div>
    </main>
  );
}
