const express = require('express');
const { createAnonSupabaseClient } = require('../config/supabase');

const router = express.Router();

// GET /preguntas – público
router.get('/', async (req, res) => {
  const anonClient = createAnonSupabaseClient();
  const { data, error } = await anonClient
    .from('pregunta')   // nombre correcto de la tabla
    .select('id, texto, categoria, orden')
    .order('categoria', { ascending: true })
    .order('orden', { ascending: true });

  if (error) {
    return res.status(500).json({ error: 'Error al obtener las preguntas' });
  }

  return res.json(data);
});

module.exports = router;