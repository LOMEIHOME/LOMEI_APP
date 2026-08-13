import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente con cookies del usuario — respeta RLS
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignorar en Server Components read-only
        }
      },
    },
  });
}

// Cliente con service role key — bypasea RLS, usar solo en API routes de admin
export function createServiceRoleClient() {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
