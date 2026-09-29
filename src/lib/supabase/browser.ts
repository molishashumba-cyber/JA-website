"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./config";

// Used in the admin area's browser code to upload photos straight to storage.
export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
