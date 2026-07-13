import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Este cliente es seguro en el browser -- usa anon key + RLS
export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});