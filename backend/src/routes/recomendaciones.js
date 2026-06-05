const express = require('express');
const { supabase, supabaseAdmin, createAnonSupabaseClient } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/recomendaciones (autenticado)
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { categoria } = req.query;

  try {
    // Obtener último nivel por categoría
    const { data: resultados, error: resError } = await req.supabase
      .from('resultado')
      .select('categoria, nivel')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: false });

    if (resError) throw resError;

    const ultimosNiveles = {};
    resultados.forEach(r => {
      if (!ultimosNiveles[r.categoria]) ultimosNiveles[r.categoria] = r.nivel;
    });

    if (Object.keys(ultimosNiveles).length === 0) return res.json([]);

    let query = supabaseAdmin.from('recomendacion').select('*');
    if (categoria) query = query.eq('categoria', categoria);
    else query = query.in('categoria', Object.keys(ultimosNiveles));

    const { data: recomendaciones, error: recError } = await query;
    if (recError) throw recError;

    const filtradas = recomendaciones.filter(rec => {
      if (!rec.nivel) return true;
      return ultimosNiveles[rec.categoria] === rec.nivel;
    });
    res.json(filtradas);
  } catch (err) {
    console.error('Error al obtener recomendaciones:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recomendaciones/por-niveles (público)
router.post('/por-niveles', async (req, res) => {
  const { niveles } = req.body;
  if (!niveles || typeof niveles !== 'object' || Object.keys(niveles).length === 0) {
    return res.status(400).json({ error: 'Debe enviar un objeto niveles con { categoria: nivel }' });
  }

  try {
    const categorias = Object.keys(niveles);
    const { data: recomendaciones, error } = await supabaseAdmin
      .from('recomendacion')
      .select('*')
      .in('categoria', categorias);
    if (error) throw error;

    const filtradas = recomendaciones.filter(rec => {
      if (!rec.nivel) return true;
      return niveles[rec.categoria] === rec.nivel;
    });
    res.json(filtradas);
  } catch (err) {
    console.error('Error al obtener recomendaciones por niveles:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recomendaciones/todas (público)
router.get('/todas', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('recomendacion')
      .select('*')
      .order('id');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error al obtener todas las recomendaciones:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;