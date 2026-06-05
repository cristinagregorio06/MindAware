const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /perfil
router.get('/', async (req, res) => {
  const usuarioId = req.user.id;

  const { data, error } = await req.supabase
    .from('profiles')
    .select('id, email, nombre, created_at')
    .eq('id', usuarioId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
  }

  return res.json(data);
});

// PUT /perfil
router.put('/', async (req, res) => {
  const usuarioId = req.user.id;
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    return res.status(400).json({ error: 'El campo nombre es obligatorio y debe ser texto' });
  }

  const { data, error } = await req.supabase
    .from('profiles')
    .update({ nombre: nombre.trim() })
    .eq('id', usuarioId)
    .select('id, email, nombre, created_at')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Error al actualizar el perfil' });
  }

  return res.json(data);
});

// GET /perfil/actividades
router.get('/actividades', async (req, res) => {
  const usuarioId = req.user.id;

  const { data, error } = await req.supabase
    .from('actividad_usuario')
    .select('id, tipo, descripcion, fecha')
    .eq('usuario_id', usuarioId)
    .order('fecha', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Error al obtener las actividades' });
  }

  return res.json(data);
});

// POST /perfil/actividades
router.post('/actividades', async (req, res) => {
  const usuarioId = req.user.id;
  const { tipo, descripcion } = req.body;

  const tiposValidos = ['pauta', 'ejercicio', 'medida'];

  if (!tipo || !tiposValidos.includes(tipo)) {
    return res.status(400).json({
      error: `El campo tipo es obligatorio. Valores permitidos: ${tiposValidos.join(', ')}`
    });
  }

  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }

  const { data, error } = await req.supabase
    .from('actividad_usuario')
    .insert({
      usuario_id: usuarioId,
      tipo,
      descripcion: descripcion.trim()
    })
    .select('id, tipo, descripcion, fecha')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Error al guardar la actividad' });
  }

  return res.status(201).json(data);
});

module.exports = router;