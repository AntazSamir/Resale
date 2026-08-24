import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env["SUPABASE_URL"] ||
  process.env["VITE_SUPABASE_URL"] ||
  "https://taqsfmxkiznbjyxbmbge.supabase.co";

let adminClient: SupabaseClient | null = null;

/**
 * Server-only Supabase client authenticated with the SERVICE ROLE key.
 * Bypasses RLS entirely — NEVER import this from client-side code.
 * The key must exist as SUPABASE_SERVICE_ROLE_KEY in the server environment
 * (.env locally, Vercel/Cloudflare env vars in production).
 */
export function getSupabaseAdmin(): SupabaseClient {
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set in the server environment. " +
        "Add it to .env (local) and your hosting provider dashboard (production).",
    );
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
