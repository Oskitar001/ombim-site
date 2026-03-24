// lib/supabaseAdmin.js
// Cliente administrativo con validación y manejo de errores seguro.

import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("❌ Falta NEXT_PUBLIC_SUPABASE_URL en variables de entorno");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Falta SUPABASE_SERVICE_ROLE_KEY en variables de entorno");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);