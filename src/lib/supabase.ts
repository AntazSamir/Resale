import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env["VITE_SUPABASE_URL"] ||
  (typeof process !== "undefined" ? process.env["SUPABASE_URL"] : "") ||
  "https://taqsfmxkiznbjyxbmbge.supabase.co";

const supabaseAnonKey =
  import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
  (typeof process !== "undefined" ? process.env["SUPABASE_ANON_KEY"] : "") ||
  "sb_publishable_yX2oOIHAzCMGLeazCCb9vg_ev_XaoDc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
