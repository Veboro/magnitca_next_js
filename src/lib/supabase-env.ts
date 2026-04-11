function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return "";
}

export function getSupabaseUrl() {
  return readEnv(
    "NEXT_PUBLIC_APP_SUPABASE_URL",
    "APP_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "VITE_SUPABASE_URL",
    "SUPABASE_URL"
  );
}

export function getSupabaseAnonKey() {
  return readEnv(
    "NEXT_PUBLIC_APP_SUPABASE_PUBLISHABLE_KEY",
    "APP_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY"
  );
}
