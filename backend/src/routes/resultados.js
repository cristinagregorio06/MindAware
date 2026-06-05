const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/resultados (si realmente se necesita guardar resultados desde frontend)
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { resultados } = req.body;

  if (!resultados || !Array.isArray(resultados) || resultados.length === 0) {
    return res.status(400).json({ error: 'Debe enviar un array de resultados' });
  }

  try {
    // Asegurar que el perfil existe (opcional)
    const profileData = { id: userId, email: req.user.email, nombre: req.user.user_metadata?.nombre || '' };
    await req.supabase.from('profiles').upsert([profileData], { onConflict: 'id', ignoreDuplicates: true });

    const rows = resultados.map(r => ({
      usuario_id: userId,
      categoria: r.categoria,
      puntaje: r.puntaje,
      nivel: r.nivel,
      fecha: new Date()
    }));

    const { error } = await req.supabase.from('resultado').insert(rows);
    if (error) throw error;

    res.status(201).json({ message: 'Resultados guardados correctamente', resultados: rows });
  } catch (err) {
    console.error('Error al guardar resultados:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resultados
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await req.supabase
      .from('resultado')
      .select('*')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error al obtener resultados:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resultados/evolucion
router.get('/evolucion', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await req.supabase
      .from('resultado')
      .select('categoria, puntaje, fecha')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: true });

    if (error) throw error;

    const evolucion = {};
    data.forEach(item => {
      if (!evolucion[item.categoria]) evolucion[item.categoria] = [];
      evolucion[item.categoria].push({ fecha: item.fecha, puntaje: item.puntaje });
    });
    res.json(evolucion);
  } catch (err) {
    console.error('Error al obtener evolución:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;