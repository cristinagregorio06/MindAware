/**
 * apiService.ts
 * Centraliza todas las llamadas HTTP al backend de MindAware y los tipos
 * de respuesta de cada endpoint.
 */

const API_URL = 'http://localhost:3001'

// ─────────────────────────────────────────────────────────────────
// TIPOS DE RESPUESTA
// ─────────────────────────────────────────────────────────────────

// ── Auth ──────────────────────────────────────────────────────────

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface AuthUserRaw {
  id: string
  email: string
  user_metadata?: {
    nombre?: string
    [key: string]: unknown
  }
}

export interface LoginResponse {
  message: string
  user: AuthUserRaw
  session: AuthSession
}

export interface RegisterResponse {
  message: string
  user: AuthUserRaw
  session: AuthSession | null
}

export interface RefreshResponse {
  session: AuthSession
  user: AuthUserRaw
}

export interface LogoutResponse {
  message: string
}

// ── Preguntas ─────────────────────────────────────────────────────

export interface PreguntaDB {
  id: number
  texto: string
  categoria: string
  orden: number
}

// ── Respuestas ────────────────────────────────────────────────────

export interface RespuestaItem {
  pregunta_id: number
  valor: number
}

export interface RespuestasResponse {
  message: string
  resultados: ResultadoDB[]
}

// ── Resultados ────────────────────────────────────────────────────

export interface ResultadoDB {
  id: string
  usuario_id: string
  categoria: string
  puntaje: number
  nivel?: string
  fecha: string
}

export interface GuardarResultadosResponse {
  message: string
  resultados: ResultadoDB[]
}

/** Clave: nombre de categoría (ej. "autoestima") → array de puntos en el tiempo */
export type EvolucionResponse = Record<string, { fecha: string; puntaje: number }[]>

// ── Recomendaciones ───────────────────────────────────────────────

export interface RecomendacionDB {
  id: number
  tipo: string
  titulo: string
  descripcion: string
  url: string | null
  categoria: string
  nivel: string
}

/** Body para POST /recomendaciones/por-niveles */
export interface NivelesPorCategoria {
  [categoria: string]: 'bajo' | 'medio' | 'alto'
}

// ── Perfil ────────────────────────────────────────────────────────

export interface PerfilResponse {
  id: string
  email: string
  nombre: string
  created_at: string
}

// ── Diario ────────────────────────────────────────────────────────

export interface DiaryEntryDB {
  id: string
  fecha: string
  humor: number
  horasMovil: number
  notas: string
  logros: string[]
  createdAt: string
}

export interface DiaryEntryBody {
  fecha: string
  humor: number
  horasMovil: number
  notas: string
  logros: string[]
}

// ── Perfil / Actividades ──────────────────────────────────────────

export interface ActividadDB {
  id: string
  tipo: 'pauta' | 'ejercicio' | 'medida'
  descripcion: string
  fecha: string
}

// ─────────────────────────────────────────────────────────────────
// FUNCIONES DE SERVICIO
// ─────────────────────────────────────────────────────────────────

// Cabecera de autenticación
const authHeaders = (token: string): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

const jsonHeaders: HeadersInit = { 'Content-Type': 'application/json' }

// ── Auth ──────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas')
  return data as LoginResponse
}

export async function register(
  email: string,
  password: string,
  nombre: string
): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password, nombre }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al crear la cuenta')
  return data as RegisterResponse
}

export async function refreshToken(refresh_token: string): Promise<RefreshResponse> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ refresh_token }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Sesión expirada')
  return data as RefreshResponse
}

export async function logout(token: string): Promise<LogoutResponse> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al cerrar sesión')
  return data as LogoutResponse
}

export async function deleteAccount(token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/delete-account`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al eliminar la cuenta')
  return data as { message: string }
}

// ── Preguntas ─────────────────────────────────────────────────────

export async function getPreguntas(): Promise<PreguntaDB[]> {
  const res = await fetch(`${API_URL}/preguntas`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener las preguntas')
  return data as PreguntaDB[]
}

// ── Respuestas ────────────────────────────────────────────────────

export async function enviarRespuestas(
  respuestas: RespuestaItem[],
  token: string
): Promise<RespuestasResponse> {
  const res = await fetch(`${API_URL}/respuestas`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ respuestas }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al enviar las respuestas')
  return data as RespuestasResponse
}

// ── Resultados ────────────────────────────────────────────────────

export async function getResultados(token: string): Promise<ResultadoDB[]> {
  const res = await fetch(`${API_URL}/resultados`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener los resultados')
  return data as ResultadoDB[]
}

export async function guardarResultados(
  resultados: Omit<ResultadoDB, 'id' | 'usuario_id'>[],
  token: string
): Promise<GuardarResultadosResponse> {
  const res = await fetch(`${API_URL}/resultados`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ resultados }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al guardar los resultados')
  return data as GuardarResultadosResponse
}

export async function getEvolucion(token: string): Promise<EvolucionResponse> {
  const res = await fetch(`${API_URL}/resultados/evolucion`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener la evolución')
  return data as EvolucionResponse
}

// ── Recomendaciones ───────────────────────────────────────────────

export async function getRecomendaciones(
  token: string,
  categoria?: string
): Promise<RecomendacionDB[]> {
  const url = categoria
    ? `${API_URL}/recomendaciones?categoria=${encodeURIComponent(categoria)}`
    : `${API_URL}/recomendaciones`
  const res = await fetch(url, { headers: authHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener las recomendaciones')
  return data as RecomendacionDB[]
}

export async function getRecomendacionesPorNiveles(
  niveles: NivelesPorCategoria
): Promise<RecomendacionDB[]> {
  const res = await fetch(`${API_URL}/recomendaciones/por-niveles`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ niveles }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener recomendaciones por niveles')
  return data as RecomendacionDB[]
}

export async function getTodasRecomendaciones(): Promise<RecomendacionDB[]> {
  const res = await fetch(`${API_URL}/recomendaciones/todas`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener las recomendaciones')
  return data as RecomendacionDB[]
}

// ── Perfil ────────────────────────────────────────────────────────

export async function getPerfil(token: string): Promise<PerfilResponse> {
  const res = await fetch(`${API_URL}/perfil`, { headers: authHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener el perfil')
  return data as PerfilResponse
}

export async function updatePerfil(nombre: string, token: string): Promise<PerfilResponse> {
  const res = await fetch(`${API_URL}/perfil`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ nombre }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al actualizar el perfil')
  return data as PerfilResponse
}

// ── Perfil / Actividades ──────────────────────────────────────────

export async function getActividades(token: string): Promise<ActividadDB[]> {
  const res = await fetch(`${API_URL}/perfil/actividades`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al obtener las actividades')
  return data as ActividadDB[]
}

export async function addActividad(
  tipo: 'pauta' | 'ejercicio' | 'medida',
  descripcion: string,
  token: string
): Promise<ActividadDB> {
  const res = await fetch(`${API_URL}/perfil/actividades`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ tipo, descripcion }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al guardar la actividad')
  return data as ActividadDB
}

// ── Diario ────────────────────────────────────────────────────────

export async function getDiario(token: string): Promise<DiaryEntryDB[]> {
  const res = await fetch(`${API_URL}/diario`, { headers: authHeaders(token) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al cargar el diario')
  return data as DiaryEntryDB[]
}

export async function createDiarioEntry(
  entry: DiaryEntryBody,
  token: string
): Promise<DiaryEntryDB> {
  const res = await fetch(`${API_URL}/diario`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(entry),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al crear la entrada')
  return data as DiaryEntryDB
}

export async function updateDiarioEntry(
  id: string,
  entry: DiaryEntryBody,
  token: string
): Promise<DiaryEntryDB> {
  const res = await fetch(`${API_URL}/diario/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(entry),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al actualizar la entrada')
  return data as DiaryEntryDB
}

export async function deleteDiarioEntry(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/diario/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error || 'Error al eliminar la entrada')
  }
}
