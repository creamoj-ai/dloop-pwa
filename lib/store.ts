import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './supabase';

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem['id'], product_data: CartItem) => void;
  removeItem: (productId: CartItem['id']) => void;
  updateQuantity: (productId: CartItem['id'], quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, product_data) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === productId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product_data, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      total: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'dloop-cart',
      skipHydration: true,
    }
  )
);
