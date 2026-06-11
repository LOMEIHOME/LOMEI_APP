// Re-export clientes de Supabase para fácil acceso
export { createClient as createServerClient } from "@/lib/supabase/server";
export { createClient as createBrowserClient } from "@/lib/supabase/browser";
export type { Database } from "@/lib/database.types";
