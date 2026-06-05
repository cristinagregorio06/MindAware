const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { env } = require('./config/env');
const { supabaseAdmin, createAnonSupabaseClient } = require('./config/supabase');
const authRoutes = require('./routes/auth');
const preguntasRoutes = require('./routes/preguntas');
const respuestasRoutes = require('./routes/respuestas');
const resultadosRoutes = require('./routes/resultados');
const recomendacionesRoutes = require('./routes/recomendaciones');
const perfilRoutes = require('./routes/perfil');
const diarioRoutes = require('./routes/diario');

const app = express();

app.use(cors({
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Por favor, inténtalo más tarde.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticación. Inténtalo más tarde.' }
});

app.use(limiter);
app.use('/auth', authLimiter, authRoutes);
app.use('/preguntas', preguntasRoutes);
app.use('/respuestas', respuestasRoutes);
app.use('/resultados', resultadosRoutes);
app.use('/recomendaciones', recomendacionesRoutes);
app.use('/perfil', perfilRoutes);
app.use('/diario', diarioRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/db', async (_req, res) => {
  const anonClient = createAnonSupabaseClient();
  const { error } = await anonClient
    .from('pregunta')
    .select('id', { head: true, count: 'exact' })
    .limit(1);
  if (error) {
    return res.status(500).json({ status: 'error', service: 'supabase', error: error.message });
  }
  const { error: authError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (authError) {
    return res.status(500).json({ status: 'error', service: 'supabase-auth', error: authError.message });
  }
  return res.json({ status: 'ok', services: ['database', 'auth'] });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = { app };