'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Order } from '@/lib/supabase';

// Status Badge Component
function StatusBadge({ status }: { status: Order['status'] }) {
  const badges = {
    PENDING: { label: 'In Attesa', color: 'bg-yellow-100 text-yellow-800', emoji: '⏳' },
    ASSIGNED: { label: 'Assegnato', color: 'bg-blue-100 text-blue-800', emoji: '🚗' },
    IN_PICKUP: { label: 'Ritiro', color: 'bg-purple-100 text-purple-800', emoji: '🏪' },
    IN_DELIVERY: { label: 'In Consegna', color: 'bg-orange-100 text-orange-800', emoji: '🚚' },
    DELIVERED: { label: 'Consegnato', color: 'bg-green-100 text-green-800', emoji: '✅' },
  };

  const badge = badges[status] || badges.PENDING;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
      {badge.emoji} {badge.label}
    </span>
  );
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);

  useEffect(() => {
    // Get customer phone from localStorage
    const phone = localStorage.getItem('dloop_customer_phone');
    setCustomerPhone(phone);

    if (phone) {
      fetchOrders(phone);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchOrders(phone: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('market_orders')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  // Real-time subscription for order updates
  useEffect(() => {
    if (!customerPhone) return;

    const channel = supabase.channel('order-updates');
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_orders',
          filter: `customer_phone=eq.${customerPhone}`,
        },
        (payload) => {
          // Update orders list
          setOrders((prev) => {
            const updated = prev.map((o) =>
              o.id === (payload.new as any).id ? (payload.new as Order) : o
            );
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [customerPhone]);

  // Filter by status
  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  // No phone in localStorage
  if (!loading && !customerPhone) {
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
          <p className="text-gray-600 mb-4">Non hai ancora effettuato ordini</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            → Inizia a Ordinare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">📦 I Miei Ordini</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtra per Stato:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tutti gli Ordini</option>
            <option value="PENDING">⏳ In Attesa</option>
            <option value="ASSIGNED">🚗 Assegnato</option>
            <option value="IN_PICKUP">🏪 Ritiro in Corso</option>
            <option value="IN_DELIVERY">🚚 In Consegna</option>
            <option value="DELIVERED">✅ Consegnato</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Caricamento ordini...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Ordine #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Order Details */}
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Prodotti:</span> {order.items}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Indirizzo:</span> {order.customer_address}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-gray-700 font-semibold">Totale:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      €{order.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-4 text-center">
                  <span className="text-blue-600 font-semibold">→ Traccia Ordine</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all'
                ? 'Nessun ordine trovato'
                : `Nessun ordine con stato "${statusFilter}"`}
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              → Vai al Catalogo
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
