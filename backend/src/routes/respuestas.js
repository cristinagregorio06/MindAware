const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// DIMENSIONES: exactamente como las espera la restricción CHECK
const DIMENSIONES = [
  'autoestima_digital',
  'ansiedad_digital',
  'confianza_futuro',
  'depresion',
  'panico_informativo',
  'soledad',
  'satisfaccion_vital'
];

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const respuestas = req.body.respuestas;

  if (!respuestas || !Array.isArray(respuestas) || respuestas.length === 0) {
    return res.status(400).json({ error: 'Debe enviar un array de respuestas' });
  }

  try {
    // 1. Guardar respuestas en tabla 'respuesta'
    const respuestasConUsuario = respuestas.map(r => ({
      usuario_id: userId,
      pregunta_id: r.pregunta_id,
      valor: r.valor,
      fecha: new Date()
    }));

    const { error: insertError } = await req.supabase
      .from('respuesta')
      .insert(respuestasConUsuario);

    if (insertError) throw insertError;

    // 2. Obtener categorías de las preguntas
    const preguntaIds = respuestas.map(r => r.pregunta_id);
    const { data: preguntas, error: pregError } = await req.supabase
      .from('pregunta')
      .select('id, categoria')
      .in('id', preguntaIds);

    if (pregError) throw pregError;

    if (preguntas.length !== preguntaIds.length) {
      return res.status(400).json({ error: 'Alguna pregunta no existe en la base de datos' });
    }

    const preguntaCategoria = {};
    preguntas.forEach(p => { preguntaCategoria[p.id] = p.categoria; });

    // 3. Agrupar puntuaciones por dimensión
    const puntuaciones = {};
    DIMENSIONES.forEach(d => puntuaciones[d] = []);

    respuestas.forEach(r => {
      const cat = preguntaCategoria[r.pregunta_id];
      if (cat && puntuaciones[cat]) {
        puntuaciones[cat].push(r.valor);
      }
    });

    // 4. Calcular resultados (puntaje entre 1 y 5, sin normalizar)
    const resultados = [];
    for (const [dimension, valores] of Object.entries(puntuaciones)) {
      if (valores.length === 0) continue;
      const suma = valores.reduce((acc, v) => acc + v, 0);
      const promedio = suma / valores.length;

      let nivel = 'bajo';
      if (promedio >= 4.3) nivel = 'alto';
      else if (promedio >= 2.6) nivel = 'medio';

      resultados.push({
        usuario_id: userId,
        categoria: dimension,
        puntaje: promedio,
        nivel,
        fecha: new Date()
      });
    }

    // 5. Guardar resultados
    const { error: resError } = await req.supabase
      .from('resultado')
      .insert(resultados);

    if (resError) throw resError;

    res.status(201).json({
      message: 'Respuestas guardadas y resultados calculados',
      resultados
    });
  } catch (err) {
    console.error('Error al procesar respuestas:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;