const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const router = express.Router();

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post('/register', async (req, res) => {
  const { email, password, nombre } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user || !data.user.identities || data.user.identities.length === 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    const { error: profileError } = await supabaseAdmin
      .from('usuario')
      .upsert([{ id: data.user.id, nombre, email }], { onConflict: 'id' });

    if (profileError) throw profileError;

    res.status(201).json({ 
      message: 'Usuario registrado correctamente', 
      user: data.user,
      session: data.session 
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuario')
      .select('nombre')
      .eq('email', data.user.email)
      .single();

    console.log('[LOGIN] email:', data.user.email);
    console.log('[LOGIN] userData:', userData);
    console.log('[LOGIN] userError:', userError);

    const userWithNombre = {
      ...data.user,
      user_metadata: {
        ...(data.user.user_metadata || {}),
        nombre: userData?.nombre || null,
      },
    };

    res.json({ 
      message: 'Login exitoso', 
      user: userWithNombre,
      session: data.session 
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'refresh_token requerido' });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error || !data.session) {
      return res.status(401).json({ error: 'Sesión expirada. Por favor inicia sesión de nuevo.' });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuario')
      .select('nombre')
      .eq('email', data.user.email)
      .single();

    if (userError) {
      console.warn('Error getting user name on refresh:', userError);
    }

    const userWithNombre = {
      ...data.user,
      user_metadata: {
        ...(data.user.user_metadata || {}),
        nombre: userData?.nombre || null,
      },
    };

    res.json({
      session: data.session,
      user: userWithNombre,
    });
  } catch (err) {
    console.error('Error al refrescar token:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) throw error;
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    console.error('Error en logout:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/auth/delete-account
 * Elimina la cuenta del usuario (requiere autenticación)
 */
router.delete('/delete-account', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // Obtener el usuario del token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const userId = user.id;
    const userEmail = user.email;

    // Eliminar el registro de la tabla usuario (buscando por email)
    const { error: deleteUserError } = await supabaseAdmin
      .from('usuario')
      .delete()
      .eq('email', userEmail);

    if (deleteUserError) {
      console.error('Error eliminando usuario de tabla:', deleteUserError);
      throw deleteUserError;
    }

    // Eliminar la cuenta de autenticación
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('Error eliminando usuario de auth:', deleteAuthError);
      throw deleteAuthError;
    }

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar cuenta:', err);
    res.status(500).json({ error: err.message || 'Error al eliminar la cuenta' });
  }
});

module.exports = router;