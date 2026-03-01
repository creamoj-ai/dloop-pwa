import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">🚀 Dloop</h1>
          <p className="text-lg text-gray-600">Catalogo Prodotti PWA (v1.1)</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Database</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✅ Supabase
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Auth</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🔐 Magic Link
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">PWA</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              📱 Live
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <Link
            href="/catalog"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            → Vai al Catalogo
          </Link>
          <Link
            href="/cart"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition"
          >
            🛒 Carrello
          </Link>
        </div>

        {/* Status */}
        <div className="text-sm text-gray-600">
          <p>Day 1 - Setup Base ✅</p>
          <p>Next: Catalogo + Products</p>
        </div>
      </div>
    </main>
  );
}
