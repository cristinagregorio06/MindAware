const express = require('express');
const authMiddleware = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

const router = express.Router();

// All diary routes require authentication
router.use(authMiddleware);

/**
 * GET /api/diario
 * Returns all diary entries for the authenticated user, sorted by date desc
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('entrada_diario')
      .select('*')
      .eq('user_id', req.user.id)
      .order('fecha_entrada', { ascending: false });

    if (error) throw error;

    // Map DB columns to frontend camelCase
    const entries = (data || []).map(row => ({
      id: row.id,
      fecha: row.fecha_entrada,
      humor: row.mood,
      horasMovil: Number(row.total_horas_movil) || 0,
      notas: row.notas || '',
      logros: row.habitos_completados || [],
      createdAt: row.created_at,
    }));

    res.json(entries);
  } catch (err) {
    console.error('Error fetching diary:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/diario
 * Create a new diary entry
 */
router.post('/', async (req, res) => {
  const { fecha, humor, horasMovil, notas, logros } = req.body;

  if (!fecha || !humor) {
    return res.status(400).json({ error: 'fecha y humor son obligatorios' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('entrada_diario')
      .insert({
        user_id: req.user.id,
        fecha_entrada: fecha,
        mood: humor,
        total_horas_movil: horasMovil || 0,
        notas: notas || '',
        habitos_completados: logros || [],
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      fecha: data.fecha_entrada,
      humor: data.mood,
      horasMovil: Number(data.total_horas_movil) || 0,
      notas: data.notas || '',
      logros: data.habitos_completados || [],
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error('Error creating diary entry:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/diario/:id
 * Update an existing diary entry (only if owned by user)
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, humor, horasMovil, notas, logros } = req.body;

  if (!fecha || !humor) {
    return res.status(400).json({ error: 'fecha y humor son obligatorios' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('entrada_diario')
      .update({
        fecha_entrada: fecha,
        mood: humor,
        total_horas_movil: horasMovil || 0,
        notas: notas || '',
        habitos_completados: logros || [],
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Entrada no encontrada' });

    res.json({
      id: data.id,
      fecha: data.fecha_entrada,
      humor: data.mood,
      horasMovil: Number(data.total_horas_movil) || 0,
      notas: data.notas || '',
      logros: data.habitos_completados || [],
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error('Error updating diary entry:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/diario/:id
 * Delete a diary entry (only if owned by user)
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que la entrada existe y pertenece al usuario
    const { data: existing } = await supabaseAdmin
      .from('entrada_diario')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    const { error } = await supabaseAdmin
      .from('entrada_diario')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Entrada eliminada' });
  } catch (err) {
    console.error('Error deleting diary entry:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
