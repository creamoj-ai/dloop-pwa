import { createClient } from '@supabase/supabase-js';

// Hardcoded values (fallback if env vars fail)
const FALLBACK_URL = 'https://aqpwfurradxbnqvycvkm.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcHdmdXJyYWR4Ym5xdnljdmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTk3NzAsImV4cCI6MjA4NTY5NTc3MH0.Ekhco06o8_88e8tQJHm4EjEa0HOQv8Z-gAHa1busvog';

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
  in_stock: number;
  category: string;
  dealer_id?: string;
  created_at?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  total_price: number;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PICKUP' | 'IN_DELIVERY' | 'DELIVERED';
  assigned_rider_id?: string;
  assigned_at?: string;
  pickup_at?: string;
  delivery_started_at?: string;
  delivered_at?: string;
  estimated_arrival?: string;
  created_at: string;
};

export type Rider = {
  id: string;
  name: string;
  rating: number;
  phone: string;
  status: string;
};
