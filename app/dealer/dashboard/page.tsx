'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Dealer {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  status: string;
  is_active: boolean;
}

export default function DealerDashboard() {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');

  useEffect(() => {
    loadDealerData();
  }, []);

  const loadDealerData = async () => {
    try {
      // TODO: Implement auth - for now use hardcoded test dealer
      const { data, error: fetchError } = await supabase
        .from('dealers')
        .select('*')
        .eq('status', 'active')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;
      setDealer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dealer data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Caricamento...</div>
      </div>
    );
  }

  if (error || !dealer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accesso Negato</h1>
          <p className="text-gray-600 mb-6">{error || 'Nessun negozio trovato'}</p>
          <a
            href="/dealer/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Registra Negozio
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🚀 Dloop Dashboard</h1>
            <p className="text-gray-600">{dealer.business_name}</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Alert */}
        {!dealer.is_active && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              ⚠️ Il tuo negozio non è ancora attivo. Completa il setup per iniziare a ricevere ordini.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Ordini Totali</div>
            <div className="text-3xl font-bold text-blue-600">12</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Guadagni</div>
            <div className="text-3xl font-bold text-green-600">€340</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Prodotti Attivi</div>
            <div className="text-3xl font-bold text-purple-600">8</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Rating</div>
            <div className="text-3xl font-bold text-yellow-600">4.8 ⭐</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['overview', 'products', 'orders', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'products' && '📦 Prodotti'}
              {tab === 'orders' && '📋 Ordini'}
              {tab === 'settings' && '⚙️ Impostazioni'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Info Negozio</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Nome Negozio</p>
                  <p className="text-lg font-semibold text-gray-900">{dealer.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Proprietario</p>
                  <p className="text-lg font-semibold text-gray-900">{dealer.owner_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{dealer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefono</p>
                  <p className="text-lg font-semibold text-gray-900">{dealer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categoria</p>
                  <p className="text-lg font-semibold text-gray-900">{dealer.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Indirizzo</p>
                  <p className="text-lg font-semibold text-gray-900">{dealer.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">🚀 Prossimi Step</h3>
              <ul className="space-y-2 text-blue-800">
                <li>✅ Registrazione completata</li>
                <li>⏳ Carica almeno 5 prodotti</li>
                <li>⏳ Verifica le informazioni di pagamento</li>
                <li>⏳ Leggi le linee guida Dloop</li>
                <li>🎉 Negozio attivo e visibile ai clienti!</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">I Tuoi Prodotti</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                ➕ Aggiungi Prodotto
              </button>
            </div>
            <p className="text-gray-600">La sezione prodotti sarà disponibile presto. Aggiungi prodotti dal tuo negozio.</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ordini Recenti</h2>
            <p className="text-gray-600">Nessun ordine ancora. Gli ordini dei tuoi clienti appariranno qui.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Impostazioni Negozio</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Commissione
                  </label>
                  <p className="text-lg text-gray-900">3% su ogni ordine</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pagamenti
                  </label>
                  <p className="text-gray-600">Ogni 48 ore sul tuo conto corrente</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
