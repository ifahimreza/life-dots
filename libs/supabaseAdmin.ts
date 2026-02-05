import {createClient} from "@supabase/supabase-js";
import config from "../config";

export function createSupabaseAdminClient() {
  const supabaseUrl = config.supabase.url;
  const serviceRoleKey = config.supabase.serviceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role credentials.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
