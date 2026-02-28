import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  stock: number;
  category: string;
  dealer_id?: string;
  created_at?: string;
};

export type CartItem = Product & {
  quantity: number;
};
