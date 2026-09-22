import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sxzukypocwbornhvnayg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4enVreXBvY3dib3JuaHZuYXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTEzNTAsImV4cCI6MjEwNTU2NzM1MH0.LlFVccBuO-jnLGE_uA8mDMXBqP9L3bThjQpEkfBC1uI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
