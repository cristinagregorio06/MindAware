const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente para operaciones normales (con anon key)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cliente con rol de servicio (para operaciones que requieren bypass de RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Función para crear un cliente con el token del usuario (respeta RLS)
const createAnonSupabaseClient = (token) => {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  if (token) {
    client.auth.setSession({ access_token: token, refresh_token: '' }).catch(() => {});
  }
  return client;
};

module.exports = { supabase, supabaseAdmin, createAnonSupabaseClient };