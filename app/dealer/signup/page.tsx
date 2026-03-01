'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DealerSignup() {
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    category: 'GROCERY',
    address: '',
    city: 'Napoli',
    postal_code: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dealers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess(true);
      setFormData({
        business_name: '',
        owner_name: '',
        email: '',
        phone: '',
        category: 'GROCERY',
        address: '',
        city: 'Napoli',
        postal_code: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            ← Torna alla home
          </Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Diventa Partner Dloop</h1>
          <p className="text-gray-600 mb-8">
            Registra il tuo negozio e inizia a ricevere ordini oggi
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-2">✅ Registrazione Completata!</h2>
              <p className="text-green-800 mb-4">
                Abbiamo inviato un'email di verifica a <strong>{formData.email}</strong>
              </p>
              <p className="text-green-800 mb-4">
                Clicca sul link nell'email per verificare il tuo account e accedere al dashboard.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Registra un altro negozio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Business Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Negozio *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Es. Piccolo Supermarket"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proprietario *
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  placeholder="Es. Mario Rossi"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="mario@supermarket.it"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+39 081 123 4567"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="GROCERY">Grocery / Supermercato</option>
                  <option value="PET">Prodotti per Animali</option>
                  <option value="ORGANIC">Biologico</option>
                  <option value="FASHION">Moda / Abbigliamento</option>
                  <option value="OTHER">Altro</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Indirizzo *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Via Roma 123"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* City & Postal Code */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Città *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Napoli"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CAP
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="80100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? 'Registrazione in corso...' : '📝 Registra Negozio'}
              </button>

              <p className="text-center text-gray-600 text-sm">
                Già registrato?{' '}
                <Link href="/dealer/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Accedi al dashboard
                </Link>
              </p>
            </form>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Setup Veloce</h3>
            <p className="text-gray-600">Registrati in 2 minuti, nessuna documentazione</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Intuitivo</h3>
            <p className="text-gray-600">Gestisci ordini e prodotti da un'unica piattaforma</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Guadagni Garantiti</h3>
            <p className="text-gray-600">Commissione 3%, pagamenti in 48 ore</p>
          </div>
        </div>
      </div>
    </main>
  );
}
