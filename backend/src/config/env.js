const requiredEnvKeys = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

function validateEnv() {
  const missingKeys = requiredEnvKeys.filter((key) => !process.env[key])

  if (missingKeys.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missingKeys.join(', ')}`)
  }
}

module.exports = {
  validateEnv,
  env: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  }
}