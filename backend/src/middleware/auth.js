const { supabaseAdmin, createAnonSupabaseClient } = require('../config/supabase');

/**
 * Middleware para verificar el token JWT enviado en el header Authorization.
 * Si es válido, adjunta el usuario a `req.user` y crea `req.supabase` autenticado.
 * 
 * NOTA: Se usa supabaseAdmin para la verificación del token porque tiene permisos
 * para leer la sesión independientemente de las políticas RLS.
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Usamos supabaseAdmin para verificar el token (más fiable que el cliente anónimo)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      console.error('Error verificando token:', error?.message);
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    
    // Creamos un cliente de Supabase con el token del usuario (respeta RLS)
    req.supabase = createAnonSupabaseClient(token);
    req.user = user;
    next();
  } catch (err) {
    console.error('Excepción en autenticación:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = authMiddleware;