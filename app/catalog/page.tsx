'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';
import { useCart } from '@/lib/store';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerId, setDealerId] = useState<string>('toelettatura-pet');
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Map<string, { avg: number; count: number }>>(new Map());
  const cart = useCart();

  useEffect(() => {
    fetchProducts();
    // Reset filters when dealer changes
    setCategoryFilter('all');
    setSearchText('');
  }, [dealerId]);

  // Filter products by category and search text
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by search text
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.description?.toLowerCase().includes(search) || false)
      );
    }

    setFilteredProducts(filtered);
  }, [products, categoryFilter, searchText]);

  // Fetch product reviews and calculate average ratings
  useEffect(() => {
    async function fetchReviews() {
      if (products.length === 0) return;

      try {
        const { data } = await supabase
          .from('product_reviews')
          .select('product_id, rating');

        if (!data) return;

        // Calculate average rating per product
        const ratingMap = new Map<string, { avg: number; count: number }>();

        products.forEach(product => {
          const productReviews = data.filter(r => r.product_id === product.id);
          if (productReviews.length > 0) {
            const avgRating =
              productReviews.reduce((sum, r) => sum + r.rating, 0) /
              productReviews.length;
            ratingMap.set(product.id, { avg: avgRating, count: productReviews.length });
          }
        });

        setRatings(ratingMap);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    }

    fetchReviews();
  }, [products]);

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

      // Extract available categories from products
      if (data && data.length > 0) {
        const categories = [...new Set(data.map(p => p.category).filter(Boolean))].sort();
        setAvailableCategories(categories);
        console.log('Available categories for dealer:', dealerId, categories);
        console.log('Sample products:', data.slice(0, 3));
      } else {
        setAvailableCategories([]);
      }
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
        {/* Filter Section - Restructured */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filtra Prodotti</h2>

          {/* 1. Category Filter - First (most important) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tutte le Categorie</option>
              {availableCategories.length > 0 ? (
                availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))
              ) : (
                <option disabled>Nessuna categoria disponibile</option>
              )}
            </select>
          </div>

          {/* 2. Dealer Selector - Second */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleziona Dealer:
            </label>
            <select
              value={dealerId}
              onChange={(e) => setDealerId(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="toelettatura-pet">🐾 Toelettatura Pet</option>
              <option value="piccolo-supermarket">🛒 Piccolo Supermarket</option>
              <option value="naturasi-vomero">🥬 NaturaSì Vomero</option>
              <option value="yamamay">👔 Yamamay/Carpisa Cimino</option>
            </select>
          </div>

          {/* 3. Search Bar - Third (fine-tuning) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca Prodotto:
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Es. Shampoo, Acqua, Crocchette..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
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
        {!loading && filteredProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Prodotti Disponibili ({filteredProducts.length})
              {searchText && ` - Ricerca: "${searchText}"`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url.replace(/\s+/g, '')}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image load failed:', product.image_url);
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%239ca3af%22%3E📦%3C/text%3E%3C/svg%3E';
                        }}
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

                    {/* Rating */}
                    {ratings.get(product.id) && (
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="font-semibold text-gray-900">
                          {ratings.get(product.id)!.avg.toFixed(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({ratings.get(product.id)!.count} rec.)
                        </span>
                      </div>
                    )}

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
        {!loading && filteredProducts.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {products.length === 0
                ? 'Nessun prodotto disponibile'
                : 'Nessun prodotto corrisponde ai filtri selezionati'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
