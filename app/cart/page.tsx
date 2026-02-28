'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store';

export default function CartPage() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">🛒 Carrello</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
            <p className="text-gray-600 text-lg">Il carrello è vuoto</p>
            <Link
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ← Torna al Catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">€{item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        cart.updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        cart.updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-700 font-semibold"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Riepilogo</h2>

              <div className="space-y-2 border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Articoli:</span>
                  <span className="font-semibold">{cart.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantità:</span>
                  <span className="font-semibold">
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Totale:</span>
                <span className="text-2xl text-blue-600">
                  €{cart.total().toFixed(2)}
                </span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                → Procedi al Checkout
              </button>

              <Link
                href="/catalog"
                className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold py-2"
              >
                ← Continua lo Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
