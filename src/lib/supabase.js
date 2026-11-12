import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
export const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export function databaseClient() {
  if (!supabaseUrl || !supabaseKey)
    throw new Error("Eventdatabasen er ikke konfigureret.");
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
