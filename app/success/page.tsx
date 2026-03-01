'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderIds = searchParams.get('orderIds')?.split(',') || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚀 Dloop
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-8">
          {/* Success Icon */}
          <div className="text-6xl">✅</div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            Ordine Creato con Successo!
          </h1>

          {/* Order Details */}
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600">Numero Ordini</p>
              <p className="text-2xl font-bold text-blue-600">
                {orderIds.length}
              </p>
            </div>

            {orderIds.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">ID Ordini:</p>
                <div className="space-y-2">
                  {orderIds.map((id, index) => (
                    <p key={id} className="font-mono text-sm text-gray-900">
                      Ordine {index + 1}: {id.substring(0, 8)}...
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              📱 Un rider avrà presto il tuo ordine
            </p>
            <p className="text-sm text-gray-600">
              Riceverai una notifica WhatsApp quando il rider accetterà l'ordine
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-3 text-left bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                ✓
              </span>
              <span className="text-gray-700">Ordine creato</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                ⏳
              </span>
              <span className="text-gray-700">In attesa di rider</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-700 rounded-full text-sm font-bold">
                📍
              </span>
              <span className="text-gray-700">Rider in transito</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-700 rounded-full text-sm font-bold">
                ✓
              </span>
              <span className="text-gray-700">Consegnato</span>
            </div>
          </div>

          {/* Buttons */}
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

          {/* Contact */}
          <p className="text-xs text-gray-500 mt-8">
            Hai problemi? Contatta il supporto via WhatsApp
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
