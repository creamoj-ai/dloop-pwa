'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { StarRating } from './StarRating';

export function ReviewModal({
  productId,
  productName,
  orderId,
  onClose,
  onSuccess,
}: {
  productId: string;
  productName: string;
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const customerName = localStorage.getItem('dloop_customer_name') || 'Cliente';
      const customerPhone = localStorage.getItem('dloop_customer_phone') || '';

      const { error: err } = await supabase.from('product_reviews').insert([
        {
          product_id: productId,
          order_id: orderId,
          customer_name: customerName,
          customer_phone: customerPhone,
          rating,
          comment: comment.trim() || null,
        },
      ]);

      if (err) throw err;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Errore nel salvare la recensione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lascia una Recensione</h2>
        <p className="text-gray-600 mb-6">{productName}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valutazione *
            </label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commento (Opzionale)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Es. Prodotto eccellente, consegna veloce!"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Invio...' : 'Invia Recensione'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
