import {createClient, SupabaseClient} from "@supabase/supabase-js";
import config from "../config";

let supabase: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  if (typeof window === "undefined") {
    return null;
  }

  const supabaseUrl = config.supabase?.url;
  const supabaseAnonKey = config.supabase?.anonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase env vars are missing. Auth and sync are disabled.");
    }
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
