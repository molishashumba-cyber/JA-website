// Supabase connection details come from environment variables set in Vercel
// (and in .env.local for local development). See .env.example.

// Accepts the Project URL however it was copied: with spaces, a trailing "/",
// or an API path such as "/rest/v1/" on the end. Only the base address is kept.
export function normaliseSupabaseUrl(raw: string | undefined): string {
  const value = (raw ?? "").trim().replace(/^["']|["']$/g, "");
  if (!value) return "";
  try {
    const url = new URL(value);
    // A link copied from the dashboard's address bar: supabase.com/dashboard/project/<ref>/…
    const dashboard = url.hostname.endsWith("supabase.com") && url.pathname.match(/\/project\/([a-z0-9]+)/);
    if (dashboard) return `https://${dashboard[1]}.supabase.co`;
    return url.origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid web address ("${value}"). ` +
        "It should look like https://abcdefgh.supabase.co (Supabase → Project Settings → Data API).",
    );
  }
}

export const supabaseUrl = normaliseSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Supabase calls this the "publishable" key (older projects: "anon" key).
// It is safe to expose: the database security rules decide what it can do.
export const supabaseKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ""
)
  .trim()
  .replace(/^["']|["']$/g, "");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
