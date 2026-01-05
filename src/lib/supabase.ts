import { createClient } from '@supabase/supabase-js';

// O Vite usa 'import.meta.env' para ler o arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);