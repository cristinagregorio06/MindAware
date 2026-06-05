import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Flame, Smile, BookMarked, Smartphone, CheckCircle2, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getDiario,
  createDiarioEntry,
  updateDiarioEntry,
  deleteDiarioEntry,
  type DiaryEntryDB,
} from '../api/apiService'
import './Diary.css'

// ─── Types ───────────────────────────────────────────────

type DiaryEntry = DiaryEntryDB

const HUMOR_LABELS: Record<number, { emoji: string; label: string; cls: string }> = {
  1: { emoji: '😔', label: 'Muy mal',  cls: 'humor-1' },
  2: { emoji: '😟', label: 'Mal',      cls: 'humor-2' },
  3: { emoji: '😐', label: 'Regular',  cls: 'humor-3' },
  4: { emoji: '🙂', label: 'Bien',     cls: 'humor-4' },
  5: { emoji: '😄', label: 'Muy bien', cls: 'humor-5' },
}

const HABITOS_SUGERIDOS = [
  'Hice un descanso digital',
  'Practiqué respiración consciente',
  'Salí a caminar / hice ejercicio',
  'Limité el tiempo en redes sociales',
  'Leí o escuché algo relajante',
  'Dormí las horas recomendadas',
  'Me conecté con alguien en persona',
  'Revisé mis metas semanales',
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Component ───────────────────────────────────────────

export const Diary: React.FC = () => {
  const { user, tryRefresh } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewEntry, setViewEntry] = useState<DiaryEntry | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Form state
  const [fecha, setFecha] = useState(todayISO())
  const [humor, setHumor] = useState(3)
  const [horasMovil, setHorasMovil] = useState(0)
  const [notas, setNotas] = useState('')
  const [logros, setLogros] = useState<string[]>([])
  const [logroCustom, setLogroCustom] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // ── API helpers ───────────────────────────────────────

  const getToken = () => sessionStorage.getItem('mindaware_token') || ''

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getDiario(getToken())
      setEntries(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const ensureToken = async () => {
      const refreshedToken = await tryRefresh()
      if (!refreshedToken) {
        console.error('No se pudo renovar el token. Redirigiendo a login...')
        // Redirigir al login si el token no se puede renovar
        navigate('/login')
      }
    }
    ensureToken()
  }, [tryRefresh, navigate])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Stats
  const avgHumor =
    entries.length > 0
      ? entries.reduce((a, e) => a + e.humor, 0) / entries.length
      : null

  const totalHorasMovil = entries.reduce((acc, e) => acc + (e.horasMovil || 0), 0)

  const streakDays = (() => {
    if (entries.length === 0) return 0
    const sorted = [...entries].sort((a, b) => b.fecha.localeCompare(a.fecha))
    let streak = 0
    let current = new Date()
    current.setHours(0, 0, 0, 0)
    for (const e of sorted) {
      const d = new Date(e.fecha + 'T00:00:00')
      const diff = Math.round((current.getTime() - d.getTime()) / 86400000)
      if (diff === 0 || diff === streak) {
        streak++
        current = d
      } else break
    }
    return streak
  })()

  const habitCounts: Record<string, number> = {}
  entries.forEach(e => e.logros.forEach(l => { habitCounts[l] = (habitCounts[l] || 0) + 1 }))
  const topHabit = Object.entries(habitCounts).sort((a, b) => b[1] - a[1])[0]

  // ── Form helpers ──────────────────────────────────────

  const resetForm = () => {
    setFecha(todayISO())
    setHumor(3)
    setHorasMovil(0)
    setNotas('')
    setLogros([])
    setLogroCustom('')
    setEditId(null)
  }

  const openNew = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (entry: DiaryEntry) => {
    setFecha(entry.fecha)
    setHumor(entry.humor)
    setHorasMovil(entry.horasMovil || 0)
    setNotas(entry.notas)
    setLogros([...entry.logros])
    setEditId(entry.id)
    setViewEntry(null)
    setModalOpen(true)
  }

  const toggleLogro = (l: string) => {
    setLogros(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  }

  const addCustomLogro = () => {
    const v = logroCustom.trim()
    if (v && !logros.includes(v)) {
      setLogros(prev => [...prev, v])
    }
    setLogroCustom('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    try {
      const body = { fecha, humor, horasMovil, notas, logros }

      if (editId) {
        const updated = await updateDiarioEntry(editId, body, getToken())
        setEntries(prev => prev.map(en => en.id === editId ? updated : en))
      } else {
        const created = await createDiarioEntry(body, getToken())
        setEntries(prev => [created, ...prev])
      }
      setModalOpen(false)
      resetForm()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDiarioEntry(id, getToken())
      setEntries(prev => prev.filter(e => e.id !== id))
      setConfirmDelete(null)
      setViewEntry(null)
    } catch (err) {
      console.error(err)
    }
  }

  const sorted = [...entries].sort((a, b) => b.fecha.localeCompare(a.fecha))

  // ── Render ────────────────────────────────────────────

  return (
    <div className="diary-page page-container">

      {/* ── Header ── */}
      <div className="welcome-banner diary-banner">
        <div className="diary-banner-content">
          <BookOpen size={40} className="diary-banner-icon" />
          <h1>Mi diario de bienestar</h1>
          <p>Registra tu estado de ánimo y haz seguimiento de tus hábitos digitales</p>
          {user && <span className="diary-banner-user">{user.nombre || user.email}</span>}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="diary-stats">
        <div className="diary-stat-card">
          <p className="diary-stat-value">{entries.length}</p>
          <div className="diary-stat-icon"><BookOpen size={24} /></div>
          <p className="diary-stat-label">Entradas totales</p>
        </div>
        <div className="diary-stat-card">
          <p className="diary-stat-value">{streakDays}</p>
          <div className="diary-stat-icon"><Flame size={24} style={{ color: '#ff6b6b' }} /></div>
          <p className="diary-stat-label">Días seguidos</p>
        </div>
        <div className="diary-stat-card">
          <p className="diary-stat-value">{avgHumor ? avgHumor.toFixed(1) : '–'}</p>
          <div className="diary-stat-icon"><Smile size={24} style={{ color: '#f59e0b' }} /></div>
          <p className="diary-stat-label">Humor medio</p>
        </div>
        <div className="diary-stat-card">
          <p className="diary-stat-value diary-stat-value--sm">{topHabit ? topHabit[0] : '–'}</p>
          <div className="diary-stat-icon"><BookMarked size={24} style={{ color: '#10b981' }} /></div>
          <p className="diary-stat-label">Hábito favorito</p>
        </div>
        <div className="diary-stat-card">
          <p className="diary-stat-value">{totalHorasMovil.toFixed(1)} h</p>
          <div className="diary-stat-icon"><Smartphone size={24} /></div>
          <p className="diary-stat-label">Total horas móvil</p>
        </div>
      </div>

      {/* ── New entry button ── */}
      <div className="diary-actions">
        <button className="btn btn-primary diary-new-btn" onClick={openNew}>
          + Nueva entrada
        </button>
      </div>

      {/* ── Entry list ── */}
      {loading ? (
        <div className="diary-empty">
          <p>Cargando entradas...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="diary-empty">
          <p>Aún no tienes entradas. ¡Empieza escribiendo cómo te has sentido hoy!</p>
        </div>
      ) : (
        <div className="diary-grid">
          {sorted.map(entry => {
            const h = HUMOR_LABELS[entry.humor]
            return (
              <div key={entry.id} className={`diary-card ${h.cls}`}>
            <div className="diary-card-header">
              <div className="diary-card-emoji"><span className={`humor-emoji ${h.cls}`}>{h.emoji}</span></div>
              <p className="diary-card-date">{formatDate(entry.fecha)}</p>
              <p className="diary-card-humor">{h.label}</p>
              <p className="diary-card-mobile"><Smartphone size={14} style={{ display: 'inline-block', marginRight: '4px' }} /> {entry.horasMovil.toFixed(1)} h</p>
            </div>
                <p className="diary-card-notes">{entry.notas}</p>
                {entry.logros.length > 0 && (
                  <div className="diary-card-logros">
                    {entry.logros.map(l => (
                      <span key={l} className="diary-logro-badge"><CheckCircle2 size={14} /> {l}</span>
                    ))}
                  </div>
                )}
                <div className="diary-card-actions">
                  <button className="btn-icon" title="Ver" onClick={() => setViewEntry(entry)}><Eye size={18} /></button>
                  <button className="btn-icon" title="Editar" onClick={() => openEdit(entry)}><Pencil size={18} /></button>
                  <button className="btn-icon btn-icon--danger" title="Eliminar" onClick={() => setConfirmDelete(entry.id)}><Trash2 size={18} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── View detail modal ── */}
      {viewEntry && (
        <div className="modal-overlay" onClick={() => setViewEntry(null)}>
          <div className="modal-box diary-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewEntry(null)}>✕</button>
            <div className="diary-detail-header">
              <div className="diary-detail-emoji"><span className={`humor-emoji ${HUMOR_LABELS[viewEntry.humor].cls}`} style={{ fontSize: '2rem' }}>{HUMOR_LABELS[viewEntry.humor].emoji}</span></div>
              <div>
                <h2 className="modal-title">{formatDate(viewEntry.fecha)}</h2>
                <p className="diary-detail-humor">{HUMOR_LABELS[viewEntry.humor].label}</p>
              </div>
            </div>
            <h3 className="diary-section-label">Mis reflexiones</h3>
            <p className="diary-detail-notas">{viewEntry.notas}</p>
            <h3 className="diary-section-label">Uso de móvil</h3>
            <p className="diary-detail-notas"><Smartphone size={16} style={{ display: 'inline-block', marginRight: '6px' }} />{viewEntry.horasMovil.toFixed(1)} horas</p>
            {viewEntry.logros.length > 0 && (
              <>
                <h3 className="diary-section-label">Hábitos conseguidos</h3>
                <ul className="diary-detail-logros">
                  {viewEntry.logros.map(l => (
                    <li key={l}><CheckCircle2 size={16} className="logro-check-icon" /> {l}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="diary-detail-btns">
              <button className="btn btn-secondary" onClick={() => openEdit(viewEntry)}>Editar</button>
              <button className="btn btn-danger" onClick={() => { setConfirmDelete(viewEntry.id); setViewEntry(null) }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── New / Edit modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => { setModalOpen(false); resetForm() }}>
          <div className="modal-box diary-modal diary-form-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setModalOpen(false); resetForm() }}>✕</button>
            <h2 className="modal-title">{editId ? 'Editar entrada' : 'Nueva entrada'}</h2>

            <form onSubmit={handleSubmit} className="diary-form">

              {/* Fecha */}
              <div className="diary-field">
                <label className="diary-label">Fecha</label>
                <input
                  type="date"
                  className="diary-input"
                  value={fecha}
                  max={todayISO()}
                  onChange={e => setFecha(e.target.value)}
                  required
                />
              </div>

              {/* Humor */}
              <div className="diary-field">
                <label className="diary-label">¿Cómo te has sentido hoy?</label>
                <div className="humor-selector">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      type="button"
                      key={v}
                      className={`humor-btn ${humor === v ? 'humor-btn--active' : ''}`}
                      onClick={() => setHumor(v)}
                      title={HUMOR_LABELS[v].label}
                    >
                      <span className="humor-btn-emoji" style={{ fontSize: '1.5rem' }}>{HUMOR_LABELS[v].emoji}</span>
                      <span className="humor-btn-label">{HUMOR_LABELS[v].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horas de movil */}
              <div className="diary-field">
                <label className="diary-label">Horas de uso del móvil</label>
                <input
                  type="number"
                  className="diary-input"
                  min={0}
                  max={24}
                  step={0.5}
                  value={horasMovil}
                  onChange={e => setHorasMovil(Math.max(0, Number(e.target.value)))}
                  required
                />
              </div>

              {/* Notas */}
              <div className="diary-field">
                <label className="diary-label">Reflexiones del día <span className="diary-label-optional">(opcional)</span></label>
                <textarea
                  className="diary-textarea"
                  placeholder="¿Cómo ha ido tu día? ¿Qué pensamientos quieres registrar?"
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Hábitos */}
              <div className="diary-field">
                <label className="diary-label">Hábitos conseguidos hoy</label>
                <div className="habitos-grid">
                  {HABITOS_SUGERIDOS.map(h => (
                    <label key={h} className={`habito-item ${logros.includes(h) ? 'habito-item--checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={logros.includes(h)}
                        onChange={() => toggleLogro(h)}
                      />
                      <span>{h}</span>
                    </label>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-light)' }}></div>

                {/* Custom habit */}
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                  📝 Agregar un hábito personalizado
                </p>
                <div className="habito-custom-container">
                  <textarea
                    className="habito-textarea"
                    placeholder="Escribe aquí un hábito personalizado que quieras registrar..."
                    value={logroCustom}
                    onChange={e => setLogroCustom(e.target.value)}
                    rows={3}
                  />
                  <button type="button" className="btn btn-secondary" onClick={addCustomLogro}>
                    + Añadir hábito
                  </button>
                </div>
                {logros.filter(l => !HABITOS_SUGERIDOS.includes(l)).length > 0 && (
                  <div className="logros-custom-list">
                    {logros.filter(l => !HABITOS_SUGERIDOS.includes(l)).map(l => (
                      <span key={l} className="diary-logro-badge diary-logro-badge--custom">
                        {l}
                        <button type="button" onClick={() => toggleLogro(l)}>[×]</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="diary-form-btns">
                <button type="button" className="btn btn-secondary" onClick={() => { setModalOpen(false); resetForm() }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Guardar entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm delete ── */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
            <div className="modal-title-warning"><AlertTriangle size={24} /> ¿Eliminar entrada?</div>
            <p className="diary-confirm-text">Esta acción no se puede deshacer.</p>
            <div className="diary-form-btns">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
