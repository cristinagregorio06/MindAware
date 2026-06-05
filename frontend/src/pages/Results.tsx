import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Smartphone, BookOpen, Video, Dumbbell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getRecomendaciones,
  getRecomendacionesPorNiveles,
  guardarResultados,
  type NivelesPorCategoria,
} from '../api/apiService'
import './Results.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Mapa de etiquetas para las dimensiones (cubre tanto claves del frontend como de la BD)
const DIMENSION_LABELS: { [key: string]: string } = {
  // Claves del frontend (sessionStorage)
  'AUTOESTIMA':             'Autoestima Digital',
  'AUTOESTIMA Y REDES':     'Autoestima Digital',
  'ANSIEDAD DIGITAL':       'Ansiedad Digital',
  'CONFIANZA EN EL FUTURO': 'Confianza en el Futuro',
  'DEPRESIÓN':              'Depresión / Desánimo',
  'PÁNICO INFORMATIVO':     'Pánico Informativo',
  'SOLEDAD DIGITAL':        'Soledad Digital',
  'SOLEDAD':                'Soledad Digital',
  'VIDA SATISFACTORIA':     'Vida Satisfactoria',
  // Claves de la BD (resultados históricos)
  'autoestima':             'Autoestima Digital',
  'autoestima_digital':     'Autoestima Digital',
  'ansiedad':               'Ansiedad Digital',
  'ansiedad_digital':       'Ansiedad Digital',
  'confianza_futuro':       'Confianza en el Futuro',
  'depresion':              'Depresión / Desánimo',
  'panico_informativo':     'Pánico Informativo',
  'soledad':                'Soledad Digital',
  'soledad_digital':        'Soledad Digital',
  'vida_satisfactoria':     'Vida Satisfactoria',
  'satisfaccion_vital':     'Vida Satisfactoria',
}

// Mapeo de nombres frontend → categoría BD
const DIMENSION_TO_CATEGORIA: { [key: string]: string } = {
  'AUTOESTIMA':             'autoestima',
  'AUTOESTIMA Y REDES':     'autoestima',
  'ANSIEDAD DIGITAL':       'ansiedad',
  'CONFIANZA EN EL FUTURO': 'confianza_futuro',
  'DEPRESIÓN':              'depresion',
  'PÁNICO INFORMATIVO':     'panico_informativo',
  'SOLEDAD DIGITAL':        'soledad',
  'SOLEDAD':                'soledad',
  'VIDA SATISFACTORIA':     'vida_satisfactoria',
}

// Mapeo inverso: categoría BD → etiqueta legible
const CATEGORIA_TO_LABEL: { [key: string]: string } = {
  autoestima: 'Autoestima Digital',
  ansiedad: 'Ansiedad Digital',
  confianza_futuro: 'Confianza en el Futuro',
  depresion: 'Depresión / Desánimo',
  panico_informativo: 'Pánico Informativo',
  soledad: 'Soledad Digital',
  vida_satisfactoria: 'Vida Satisfactoria',
}



const typeConfig = {
  app: {
    icon: <Smartphone size={24} />,
    label: 'App',
    color: '#A7C4A0'
  },
  articulo: {
    icon: <BookOpen size={24} />,
    label: 'Artículo',
    color: '#7B9E87'
  },
  video: {
    icon: <Video size={24} />,
    label: 'Vídeo',
    color: '#C6E2DC'
  },
  ejercicio: {
    icon: <Dumbbell size={24} />,
    label: 'Ejercicio',
    color: '#546C67'
  }
}

const getLevel = (score: number): { level: string; color: string } => {
  if (score <= 2.3) return { level: 'Bajo', color: '#4caf50' }
  if (score <= 3.7) return { level: 'Medio', color: '#ff9800' }
  return { level: 'Alto', color: '#f44336' }
}

const getDescription = (dimension: string, level: string): string => {
  // Normalizar claves de BD a claves de frontend
  const normalize: { [key: string]: string } = {
    'autoestima': 'AUTOESTIMA Y REDES', 'autoestima_digital': 'AUTOESTIMA Y REDES',
    'AUTOESTIMA': 'AUTOESTIMA Y REDES',
    'ansiedad': 'ANSIEDAD DIGITAL', 'ansiedad_digital': 'ANSIEDAD DIGITAL',
    'confianza_futuro': 'CONFIANZA EN EL FUTURO',
    'depresion': 'DEPRESIÓN',
    'panico_informativo': 'PÁNICO INFORMATIVO',
    'soledad': 'SOLEDAD', 'soledad_digital': 'SOLEDAD', 'SOLEDAD DIGITAL': 'SOLEDAD',
    'vida_satisfactoria': 'VIDA SATISFACTORIA', 'satisfaccion_vital': 'VIDA SATISFACTORIA',
  }
  const key = normalize[dimension] ?? dimension
  const descriptions: { [key: string]: { [key: string]: string } } = {
    'AUTOESTIMA Y REDES': {
      Bajo: 'Tu autoestima no depende en gran medida de las redes sociales. Mantienes una relación saludable.',
      Medio: 'A veces tu autoestima se ve influenciada por las redes, pero en general mantienes el equilibrio.',
      Alto: 'Tu autoestima está fuertemente ligada a la validación en redes. Esto puede generar dependencia emocional.'
    },
    'ANSIEDAD DIGITAL': {
      Bajo: 'No experimentas ansiedad significativa por el uso de redes. ¡Bien por ti!',
      Medio: 'En ocasiones sientes ansiedad relacionada con las redes, pero es manejable.',
      Alto: 'La ansiedad digital es alta. Revisar constantemente el móvil y la necesidad de respuesta te afectan.'
    },
    'CONFIANZA EN EL FUTURO': {
      Bajo: 'Tienes una visión positiva y confianza en tu bienestar más allá de las redes. ¡Excelente!',
      Medio: 'Tu confianza en el futuro es moderada. La comparación social puede estar influyendo levemente.',
      Alto: 'La exposición a contenidos digitales está erosionando tu visión optimista del mañana.'
    },
    'DEPRESIÓN': {
      Bajo: 'Tu estado de ánimo no se ve afectado significativamente por el uso de redes sociales.',
      Medio: 'En algunos momentos el uso de redes puede afectar tu estado anímico. Es una señal para prestar atención.',
      Alto: 'El uso intensivo de redes puede estar amplificando sentimientos de fatiga emocional o desmotivación.'
    },
    'PÁNICO INFORMATIVO': {
      Bajo: 'Gestionas bien el flujo de información y no te dejas saturar por las noticias. ¡Genial!',
      Medio: 'A veces el exceso de información te genera cierta inquietud. Puedes trabajar en un consumo más selectivo.',
      Alto: 'La sobreexposición a noticias te genera malestar. Establecer límites informativos te ayudará mucho.'
    },
    'SOLEDAD': {
      Bajo: 'Mantienes vínculos emocionales auténticos y no dependes de las redes para sentirte conectado/a.',
      Medio: 'Ocasionalmente te sientes desconectado/a pese a estar online. Las relaciones presenciales pueden ayudar.',
      Alto: 'La sensación de soledad es frecuente pese a la conectividad. Las relaciones digitales no siempre llenan el vacío.'
    },
    'VIDA SATISFACTORIA': {
      Bajo: 'Tienes un uso equilibrado de la tecnología y disfrutas de tu vida más allá de las pantallas.',
      Medio: 'El uso de tecnología empieza a afectar levemente tu satisfacción general. Pequeños cambios pueden ayudar.',
      Alto: 'La tecnología está ocupando demasiado espacio en tu vida, reduciendo tu satisfacción general.'
    },
  }
  return descriptions[key]?.[level] || `Nivel ${level} en ${DIMENSION_LABELS[dimension] ?? dimension}.`
}

// 👇 CORREGIDO: el campo se llama 'id', no 'recomendacion_id'
interface Recomendacion {
  id: number
  tipo: string
  titulo: string
  descripcion: string
  url: string | null
  categoria: string
  nivel: string
}

interface TestResults {
  [key: string]: number | string
  overall_score: number
  completed_at: string
}

// Agrupa recomendaciones por categoría
const groupByCategoria = (recs: Recomendacion[]) => {
  const grouped: { [key: string]: Recomendacion[] } = {}
  recs.forEach(rec => {
    if (!grouped[rec.categoria]) grouped[rec.categoria] = []
    grouped[rec.categoria].push(rec)
  })
  return grouped
}

const DIMENSION_TO_CATEGORIA_SAVE: { [key: string]: string } = {
  'AUTOESTIMA':             'autoestima',
  'AUTOESTIMA Y REDES':     'autoestima',
  'ANSIEDAD DIGITAL':       'ansiedad',
  'CONFIANZA EN EL FUTURO': 'confianza_futuro',
  'DEPRESIÓN':              'depresion',
  'PÁNICO INFORMATIVO':     'panico_informativo',
  'SOLEDAD DIGITAL':        'soledad',
  'SOLEDAD':                'soledad',
  'VIDA SATISFACTORIA':     'vida_satisfactoria',
}

export const Results: React.FC = () => {
  const [results, setResults] = useState<TestResults | null>(null)
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { token, apiFetch } = useAuth()

  useEffect(() => {
    const resultsData = sessionStorage.getItem('testResults')
    if (resultsData) {
      setResults(JSON.parse(resultsData))
    } else {
      navigate('/test')
    }
  }, [navigate])

  // Cuando se cargan los resultados, pedir recomendaciones al backend
  useEffect(() => {
    if (!results) return

    const fetchRecomendaciones = async () => {
      setLoadingRecs(true)
      try {
        // 👇 Mejor forma de obtener dimensiones (evita problemas de tipos)
        const dimensionKeys = Object.keys(results).filter(
          key => key !== 'overall_score' && key !== 'completed_at'
        )

        const nivelesLocales: { [key: string]: string } = {}
        dimensionKeys.forEach(dimension => {
          const categoria = DIMENSION_TO_CATEGORIA[dimension]
          if (!categoria) return
          const score = results[dimension] as number
          const nivel = score <= 2.3 ? 'bajo' : score <= 3.7 ? 'medio' : 'alto'
          nivelesLocales[categoria] = nivel
        })

        let data: Recomendacion[] = []

        if (token) {
          // Usuario registrado: primero intenta recomendaciones basadas en resultados de BD
          try {
            data = await getRecomendaciones(token)
          } catch { data = [] }
          // Si la BD no devuelve nada (primer test aún no guardado), usar niveles locales
          if (data.length === 0) {
            try {
              data = await getRecomendacionesPorNiveles(nivelesLocales as NivelesPorCategoria)
            } catch { data = [] }
          }
        } else {
          // Usuario no registrado: endpoint público con niveles calculados localmente
          try {
            data = await getRecomendacionesPorNiveles(nivelesLocales as NivelesPorCategoria)
          } catch { data = [] }
        }

        setRecomendaciones(data)
      } catch (err) {
        console.error('Error cargando recomendaciones:', err)
      } finally {
        setLoadingRecs(false)
      }
    }

    fetchRecomendaciones()
  }, [results, token])

  if (!results) {
    return <div className="loading">Cargando resultados...</div>
  }

  const dimensionKeys = Object.keys(results).filter(key => key !== 'overall_score' && key !== 'completed_at')

  const chartColors = ['#A7C4A0', '#7B9E87', '#C6E2DC', '#D9E3DB', '#546C67', '#F7F7F2', '#C6E2DC']

  const chartData = {
    labels: dimensionKeys.map(key => DIMENSION_LABELS[key] || key),
    datasets: [
      {
        label: 'Puntuación Media',
        data: dimensionKeys.map(key => results[key] || 0),
        backgroundColor: chartColors,
        borderRadius: 12,
        borderSkipped: false,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '',
        font: { size: 18, family: 'Inter, Poppins, sans-serif', weight: 'bold' as const },
        color: '#546C67',
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: '#546C67',
        titleColor: '#F7F7F2',
        bodyColor: '#F7F7F2',
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1, color: '#546C67', font: { size: 12 } },
        grid: { color: '#C6E2DC' }
      },
      x: {
        ticks: {
          color: '#546C67',
          font: { size: 11, family: 'Inter, Poppins, sans-serif', weight: 'normal' as const },
          maxRotation: 45,
          minRotation: 45
        },
        grid: { display: false }
      }
    }
  }

  const formattedDate = new Date(results.completed_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const recsAgrupadas = groupByCategoria(recomendaciones)

  const handleGuardar = async () => {
    if (!results || !token) return
    setSaving(true)
    setSaveError(null)
    try {
      const getLevel = (score: number) => {
        if (score <= 2.3) return 'bajo'
        if (score <= 3.7) return 'medio'
        return 'alto'
      }
      const dimensionKeys = Object.keys(results).filter(
        key => key !== 'overall_score' && key !== 'completed_at'
      )
      const resultadosParaGuardar = dimensionKeys
        .filter(dim => DIMENSION_TO_CATEGORIA_SAVE[dim])
        .map(dim => ({
          categoria: DIMENSION_TO_CATEGORIA_SAVE[dim],
          puntaje: Number(results[dim]),
          nivel: getLevel(Number(results[dim])),
          fecha: new Date().toISOString(),
        }))

      await guardarResultados(resultadosParaGuardar, token)
      setSaved(true)
    } catch (err) {
      setSaveError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="results">
      <div className="results-header">
        <h1>Tus Resultados</h1>
        <p className="results-date">Completado el {formattedDate}</p>
      </div>

      {/* Tarjetas de cada dimensión */}
      <div className="dimension-cards">
        {dimensionKeys.map(key => {
          const score = results[key] as number
          const { level, color } = getLevel(score)
          const displayLabel = DIMENSION_LABELS[key] || key
          return (
            <div key={key} className="dimension-card">
              <h3>{displayLabel}</h3>
              <div className="score-info">
                <span className="level" style={{ backgroundColor: color, color: 'white' }}>{level}</span>
                <span className="score">Puntuación: {score.toFixed(1)}/5</span>
              </div>
              <p className="description">{getDescription(key, level)}</p>
            </div>
          )
        })}
      </div>

      {/* Gráfico */}
      <div className="chart-container">
        <h3>Puntuaciones por dimensión</h3>
        <div style={{ height: '400px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recomendaciones personalizadas desde Supabase */}
      <div className="recommendations">
        <h2>RECOMENDACIONES PERSONALIZADAS</h2>
        {loadingRecs && <p className="loading-recs">Cargando recomendaciones...</p>}

        {!loadingRecs && recomendaciones.length === 0 && (
          <p className="no-recs">No hay recomendaciones disponibles para tu perfil en este momento.</p>
        )}

        {!loadingRecs && Object.entries(recsAgrupadas).map(([categoria, recs]) => (
          <div key={categoria} className="rec-categoria">
            <h3 className="rec-categoria-titulo">
              {CATEGORIA_TO_LABEL[categoria] || categoria}
            </h3>
            <div className="rec-grid">
              {recs.map(rec => {
                const typeConf = typeConfig[rec.tipo as keyof typeof typeConfig]
                return (
                  <div key={rec.id} className="rec-card">
                    <div className="rec-tipo-header">
                      <div className="rec-tipo-icon" style={{ backgroundColor: typeConf?.color || '#546C67' }}>
                        {typeConf?.icon || null}
                      </div>
                      <span className="rec-tipo-label">{typeConf?.label || rec.tipo}</span>
                    </div>
                    <h4 className="rec-titulo">
                      {rec.url ? (
                        <a href={rec.url} target="_blank" rel="noopener noreferrer">{rec.titulo}</a>
                      ) : (
                        rec.titulo
                      )}
                    </h4>
                    <p className="rec-descripcion">{rec.descripcion}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        {token && (
          saved ? (
            <span className="btn btn-saved">✓ Guardado</span>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleGuardar}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar resultados'}
            </button>
          )
        )}
        {saveError && <p className="save-error">{saveError}</p>}
        <Link to="/test" className="btn btn-primary">Realizar test nuevamente</Link>
      </div>
    </div>
  )
}