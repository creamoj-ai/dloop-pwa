'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';
import { useCart } from '@/lib/store';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerId, setDealerId] = useState<string>('toelettatura-pet');
  const [error, setError] = useState<string | null>(null);
  const cart = useCart();

  useEffect(() => {
    fetchProducts();
  }, [dealerId]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products for dealer:', dealerId);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('dealer_id', dealerId)
        .gt('in_stock', 0);

      console.log('Supabase response - Data:', data, 'Error:', err);

      if (err) throw err;
      setProducts(data || []);
    } catch (err: any) {
      const errorMsg = err?.message || JSON.stringify(err);
      setError(`Errore: ${errorMsg}`);
      console.error('Full error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = (product: Product) => {
    cart.addItem(product.id, { ...product, quantity: 1 });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🚀 Dloop
            </Link>
          </div>
          <Link
            href="/cart"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <span>🛒</span>
            <span className="font-semibold">{cart.items.length}</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dealer Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleziona Dealer:
          </label>
          <select
            value={dealerId}
            onChange={(e) => setDealerId(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="toelettatura-pet">🐾 Toelettatura Pet</option>
            <option value="piccolo-supermarket">🛒 Piccolo Supermarket</option>
            <option value="naturasi-vomero">🥬 NaturaSì Vomero</option>
            <option value="yamamay">👔 Yamamay/Carpisa Cimino</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Caricamento prodotti...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Prodotti Disponibili ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url.trim()}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📦</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description || 'Nessuna descrizione'}
                    </p>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        €{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Stock: {product.in_stock}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Aggiungi al Carrello
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nessun prodotto disponibile</p>
          </div>
        )}
      </div>
    </main>
  );
}
