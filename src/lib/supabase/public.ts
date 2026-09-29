import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./config";

// Tag used for all public website content. Saving in the admin area
// refreshes this tag so changes show on the site straight away.
export const CONTENT_TAG = "content";

// Read-only client for the public website (no login, no cookies).
// Responses are cached and refreshed at least every 5 minutes.
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { tags: [CONTENT_TAG], revalidate: 300 } }),
    },
  });
}

// Client for saving form submissions: no caching, no login.
export function createFormClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
