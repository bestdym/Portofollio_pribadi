import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isPlaceholder = !supabaseUrl || !supabaseUrl.startsWith('http');

let validUrl = 'https://placeholder.supabase.co';
if (!isPlaceholder) {
  validUrl = supabaseUrl;
} else {
  console.warn('Supabase URL is invalid or missing. Using placeholder.');
}

export const supabase = createClient(
  validUrl,
  supabaseAnonKey || 'placeholder'
);
