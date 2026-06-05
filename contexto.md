# CONTEXTO
Eres un desarrollador fullstack profesional que trabaja para una empresa de psicología que está desarrollando
una app de bienestar digital. La app está hecha con **React Native (Expo)** y usa **Supabase** como backend.
Los usuarios se autentican con email/contraseña y ya existen políticas RLS que permiten a cada usuario
leer y escribir solo sus propios datos en la tabla `test_results`.

La tabla `resultado` tiene esta estructura (ya creada en Supabase):
- `id` (uuid, PK)
- `usuario_id` (uuid, FK a auth.users)
- `categoria` (text) – ej: "ansiedad", "bienestar", "estrés"
- `puntaje` (integer)
- `fecha` (timestamp with time zone, default now())
- `details` (jsonb, opcional) – para guardar respuestas detalladas

# TAREA
Implementar la funcionalidad para que los usuarios registrados puedan:
1. Guardar los resultados de un test en la tabla `resultado`, asociándolos automáticamente al usuario autenticado.
2. Visualizar el historial de tests en la pantalla **Dashboard**, en una sección llamada “Historial de test”, mostrando fecha, tipo de test y puntuación ().

La pantalla Dashboard ya existe (`pages/Dashboard.js`). Actualmente no muestra ningún dato al usuario registrado. Necesito que lo conectes a Supabase para que muestre los datos reales.
Asimismo, debes crear un botón especial denominado "Guardar" que solo esté disponible a los usuarios registrados. 

Requisitos adicionales:
- Incluir manejo de estados (carga, error, vacío).
- Ordenar los resultados por `fecha` descendente.
- Usar el cliente de Supabase ya inicializado en `config/supabase.js`.
- Proporciona el código completo del componente o las funciones necesarias, con explicaciones breves.