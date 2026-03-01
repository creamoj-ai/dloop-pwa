import { createClient } from '@supabase/supabase-js';

// Hardcoded values (fallback if env vars fail)
const FALLBACK_URL = 'https://aqpwfurradxbnqvycvkm.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcHdmdXJyYWR4Ym5xdnljdmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDI0NzgsImV4cCI6MTg5NzgwOTQ3OH0.WlbMVlf5Bw9gYDzKhNvXPzPBp4SFk_YqBE5rK5qLqXo';

// Get values and clean them (trim whitespace)
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL).trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY).trim();

// Validate
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials are missing!');
  throw new Error('Supabase URL or Key is missing');
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Supabase Key:', supabaseAnonKey.substring(0, 20) + '...');

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
