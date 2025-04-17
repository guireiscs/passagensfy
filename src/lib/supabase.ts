import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase URL and anon key are stored in environment variables
// These will be set after you connect to Supabase using the "Connect to Supabase" button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are provided
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Make sure to connect to Supabase using the "Connect to Supabase" button.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '');