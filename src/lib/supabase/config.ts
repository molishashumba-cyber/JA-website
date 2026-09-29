// Supabase connection details come from environment variables set in Vercel
// (and in .env.local for local development). See .env.example.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// Supabase calls this the "publishable" key (older projects: "anon" key).
// It is safe to expose: the database security rules decide what it can do.
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
