import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getResultados, deleteAccount, type ResultadoDB } from '../api/apiService'
import './Dashboard.css'

interface Resultado extends ResultadoDB {}

const CATEGORIA_LABELS: { [key: string]: string } = {
  autoestima: 'Autoestima digital',
  ansiedad: 'Ansiedad digital',
  confianza_futuro: 'Confianza en el futuro',
  depresion: 'Depresión',
  panico_informativo: 'Pánico informativo',
  soledad: 'Soledad digital',
  vida_satisfactoria: 'Vida satisfactoria',
}

// Agrupa los resultados por sesión de test (misma fecha truncada al segundo)
interface TestSession {
  fecha: string
  puntuacionGeneral: number
  categorias: { categoria: string; puntaje: number; nivel?: string }[]
}

function groupIntoSessions(resultados: Resultado[]): TestSession[] {
  const map: { [key: string]: Resultado[] } = {}
  resultados.forEach(r => {
    const key = r.fecha.slice(0, 19)
    if (!map[key]) map[key] = []
    map[key].push(r)
  })
  return Object.entries(map)
    .map(([fecha, rows]) => ({
      fecha,
      puntuacionGeneral: rows.reduce((a, b) => a + Number(b.puntaje), 0) / rows.length,
      categorias: rows.map(r => ({ categoria: r.categoria, puntaje: Number(r.puntaje), nivel: r.nivel })),
    }))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export const Dashboard: React.FC = () => {
  const { user, token, logout, apiFetch } = useAuth()
  const navigate = useNavigate()
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailSession, setDetailSession] = useState<TestSession | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    if (!token) return
    fetchResultados()
  }, [token])

  const fetchResultados = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!token) return
        const data = await getResultados(token)
        setResultados(data)
      } catch (err) {
        setError((err as Error).message === 'Failed to fetch'
          ? 'No se puede conectar con el servidor. Comprueba que el backend está en marcha.'
          : (err as Error).message
        )
      } finally {
        setLoading(false)
      }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)
    try {
      if (!token) return
      await deleteAccount(token)
      logout()
      navigate('/')
    } catch (err) {
      alert(`Error: ${(err as Error).message}`)
    } finally {
      setDeletingAccount(false)
      setDeleteConfirmOpen(false)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const getNivelClass = (score: number) => {
    if (score <= 2.3) return 'nivel-bajo'
    if (score <= 3.7) return 'nivel-medio'
    return 'nivel-alto'
  }

  const getNivelLabel = (score: number) => {
    if (score <= 2.3) return 'Bajo'
    if (score <= 3.7) return 'Medio'
    return 'Alto'
  }

  const sessions = groupIntoSessions(resultados)

  return (
    <div className="page-container">
      {/* Sección de bienvenida */}
      <div className="welcome-banner">
        <h1>Hola, {user?.nombre || 'usuario'}</h1>
        <p>Explora tus avances y sigue creciendo</p>
      </div>

      {/* Modal historial */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => { setModalOpen(false); setDetailSession(null) }}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setModalOpen(false); setDetailSession(null) }}>✕</button>

            {detailSession ? (
              /* ── Vista detalle de una sesión ── */
              <>
                <button className="modal-back" onClick={() => setDetailSession(null)}>← Volver</button>
                <h2 className="modal-title">🗓 Test del {formatDate(detailSession.fecha)}</h2>
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th>Puntuación</th>
                        <th>Nivel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailSession.categorias.map((c, i) => (
                        <tr key={i}>
                          <td>{CATEGORIA_LABELS[c.categoria] || c.categoria}</td>
                          <td>
                            <span className={`score-badge ${getNivelClass(c.puntaje)}`}>
                              {c.puntaje.toFixed(2)} / 5
                            </span>
                          </td>
                          <td className={`nivel-text ${getNivelClass(c.puntaje)}`}>
                            {c.nivel ? c.nivel.charAt(0).toUpperCase() + c.nivel.slice(1) : getNivelLabel(c.puntaje)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td><strong>Media general</strong></td>
                        <td>
                          <span className={`score-badge ${getNivelClass(detailSession.puntuacionGeneral)}`}>
                            {detailSession.puntuacionGeneral.toFixed(2)} / 5
                          </span>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            ) : (
              /* ── Vista lista de sesiones ── */
              <>
                <h2 className="modal-title">📊 Historial de tests</h2>
                {loading ? (
                  <p className="history-loading">Cargando historial...</p>
                ) : error ? (
                  <div>
                    <p className="history-error">{error}</p>
                    <button
                      className="btn btn-secondary"
                      style={{ marginTop: '12px', fontSize: '0.875rem', padding: '6px 16px' }}
                      onClick={fetchResultados}
                    >
                      Reintentar
                    </button>
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="history-empty">Aún no tienes tests guardados. ¡Realiza tu primer test!</p>
                ) : (
                  <div className="history-table-wrapper">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Puntuación general</th>
                          <th>Detalle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s, i) => (
                          <tr key={i}>
                            <td>{formatDate(s.fecha)}</td>
                            <td>
                              <span className={`score-badge ${getNivelClass(s.puntuacionGeneral)}`}>
                                {s.puntuacionGeneral.toFixed(2)} / 5
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-detail"
                                onClick={() => setDetailSession(s)}
                              >
                                Ver →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Grid principal con las dos secciones */}
      <div className="dashboard-grid">
        {/* Historial de test */}
        <div className="dashboard-card history-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Historial de tests</h3>
            <p>Consulta tu historial de tests y observa tu evolución en el bienestar digital a lo largo del tiempo</p>
            <div className="card-buttons">
              <button
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
                disabled={!token}
              >
                Historial
              </button>
              <Link to="/test" className="btn btn-secondary">
                Realizar test
              </Link>
            </div>
          </div>
        </div>

        {/* Diario / seguimiento */}
        <div className="dashboard-card">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <h3>Diario personal</h3>
            <p>
              Lleva un diario personal para registrar tu progreso y ver cómo las recomendaciones mejoran tu bienestar día a día.
            </p>
            <div className="card-buttons">
              <Link to="/diary" className="btn btn-primary">Consultar</Link>
              <Link to="/diary" className="btn btn-secondary">Añadir nueva entrada</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar cuenta */}
      {deleteConfirmOpen && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDeleteConfirmOpen(false)}>✕</button>
            <h2 className="modal-title" style={{ color: '#EF4444' }}>⚠️ Eliminar cuenta</h2>
            <p style={{ marginBottom: '16px', lineHeight: '1.6', color: '#999' }}>
              ¿Estás seguro de que quieres eliminar tu perfil? Esta acción es <strong>irreversible</strong> y se eliminarán:
            </p>
            <ul style={{ marginBottom: '20px', marginLeft: '20px', color: '#999' }}>
              <li>Tu cuenta y datos personales</li>
              <li>Todos tus resultados de tests</li>
              <li>Tu historial de diario</li>
              <li>Tu historial de respuestas</li>
            </ul>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deletingAccount}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
              >
                {deletingAccount ? 'Eliminando...' : 'Eliminar definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}