import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPreguntas } from '../api/apiService'
import './Test.css'

// Etiquetas cortas para el stepper de progreso
const CATEGORY_SHORT_NAMES: { [key: string]: string } = {
  'AUTOESTIMA':             'Autoestima',
  'ANSIEDAD DIGITAL':       'Ansiedad',
  'CONFIANZA EN EL FUTURO': 'Confianza',
  'DEPRESIÓN':              'Depresión',
  'PÁNICO INFORMATIVO':     'Pánico info.',
  'SOLEDAD DIGITAL':        'Soledad',
  'VIDA SATISFACTORIA':     'Satisfacción',
}

// Orden de visualización de las categorías
const CATEGORY_ORDER = [
  'AUTOESTIMA',
  'ANSIEDAD DIGITAL',
  'CONFIANZA EN EL FUTURO',
  'DEPRESIÓN',
  'PÁNICO INFORMATIVO',
  'SOLEDAD DIGITAL',
  'VIDA SATISFACTORIA',
]

// Mapeo de clave de BD → nombre de dimensión para el frontend
const CATEGORIA_TO_DIMENSION: { [key: string]: string } = {
  'autoestima':         'AUTOESTIMA',
  'autoestima_digital': 'AUTOESTIMA',
  'ansiedad':           'ANSIEDAD DIGITAL',
  'ansiedad_digital':   'ANSIEDAD DIGITAL',
  'confianza_futuro':   'CONFIANZA EN EL FUTURO',
  'depresion':          'DEPRESIÓN',
  'panico_informativo': 'PÁNICO INFORMATIVO',
  'soledad':            'SOLEDAD DIGITAL',
  'soledad_digital':    'SOLEDAD DIGITAL',
  'vida_satisfactoria': 'VIDA SATISFACTORIA',
  'satisfaccion_vital': 'VIDA SATISFACTORIA',
}

// Etiqueta legible para mostrar como título de sección
const DIMENSION_DISPLAY_NAME: { [key: string]: string } = {
  'AUTOESTIMA':             'AUTOESTIMA',
  'ANSIEDAD DIGITAL':       'ANSIEDAD DIGITAL',
  'CONFIANZA EN EL FUTURO': 'CONFIANZA EN EL FUTURO',
  'DEPRESIÓN':              'DEPRESIÓN',
  'PÁNICO INFORMATIVO':     'PÁNICO INFORMATIVO',
  'SOLEDAD DIGITAL':        'SOLEDAD DIGITAL',
  'VIDA SATISFACTORIA':     'VIDA SATISFACTORIA',
}

interface Pregunta {
  id: number
  dimension: string
  text: string
}

// Opciones Likert (etiquetas como en la captura que te gustó)
const LIKERT_OPTIONS = [
  { value: 1, label: 'Nunca' },
  { value: 2, label: 'Rara vez' },
  { value: 3, label: 'A veces' },
  { value: 4, label: 'Frecuentemente' },
  { value: 5, label: 'Siempre' }
]

interface TestAnswers {
  [key: number]: number
}

export const Test: React.FC = () => {
  const [questions, setQuestions] = useState<Pregunta[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState(0)
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [showIncomplete, setShowIncomplete] = useState(false)
  const navigate = useNavigate()
  const { token } = useAuth()
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getPreguntas()
      .then(data => {
        const mapped: Pregunta[] = data.map(p => ({
          id: p.id,
          dimension: CATEGORIA_TO_DIMENSION[p.categoria] ?? p.categoria,
          text: p.texto,
        }))
        mapped.sort((a, b) => {
          const ia = CATEGORY_ORDER.indexOf(a.dimension)
          const ib = CATEGORY_ORDER.indexOf(b.dimension)
          return ia - ib
        })
        setQuestions(mapped)
      })
      .catch(() => console.error('Error al cargar las preguntas'))
      .finally(() => setLoading(false))
  }, [])

  const categories = Array.from(new Set(questions.map(q => q.dimension)))
  const questionsByCategory = categories.map(category =>
    questions.filter(q => q.dimension === category)
  )

  const currentQuestions = questionsByCategory[currentCategory] ?? []
  const currentCategoryName = categories[currentCategory] ?? ''
  const answeredInCurrent = currentQuestions.filter(q => answers[q.id] !== undefined).length
  const allCurrentAnswered = currentQuestions.length > 0 && answeredInCurrent === currentQuestions.length

  const handleAnswerSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (showIncomplete) setShowIncomplete(false)
  }

  const handleNextCategory = () => {
    if (!allCurrentAnswered) {
      setShowIncomplete(true)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setShowIncomplete(false)
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      handleSubmit()
    }
  }

  const handlePreviousCategory = () => {
    setShowIncomplete(false)
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('Por favor, responde todas las preguntas antes de continuar.')
      return
    }
    const results = calculateResults()
    const overallScore = Object.values(results).reduce((sum, val) => sum + val, 0) / Object.keys(results).length
    const finalResults = {
      ...results,
      overall_score: overallScore,
      completed_at: new Date().toISOString()
    }
    sessionStorage.setItem('testResults', JSON.stringify(finalResults))
    navigate('/results')
  }

  const calculateResults = () => {
    const dimensionScores: { [key: string]: number[] } = {}
    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer) {
        if (!dimensionScores[question.dimension]) {
          dimensionScores[question.dimension] = []
        }
        dimensionScores[question.dimension].push(answer)
      }
    })
    const results: { [key: string]: number } = {}
    Object.keys(dimensionScores).forEach(dimension => {
      const scores = dimensionScores[dimension]
      results[dimension] = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })
    return results
  }

  if (loading) {
    return (
      <div className="test">
        <div className="test-header">
          <h1>Test de Bienestar Digital</h1>
        </div>
        <div className="test-content">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando preguntas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="test" ref={topRef}>

      {/* ── Header + stepper ── */}
      <div className="test-header">
        <h1>Test de Bienestar Digital</h1>
        <div className="test-stepper">
          {categories.map((cat, idx) => (
            <div
              key={cat}
              className={`stepper-step${idx < currentCategory ? ' completed' : ''}${idx === currentCategory ? ' active' : ''}`}
            >
              <div className="stepper-dot">
                {idx < currentCategory ? '✓' : idx + 1}
              </div>
              <span className="stepper-label">{CATEGORY_SHORT_NAMES[cat]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="test-content">

        {/* Category header row */}
        <div className="category-header">
          <div>
            <h2 className="category-title">{DIMENSION_DISPLAY_NAME[currentCategoryName] ?? currentCategoryName}</h2>
            <p className="category-description">Valora cada afirmación según tu experiencia personal</p>
          </div>
          <div className="category-progress">
            <span className={`progress-count${allCurrentAnswered ? ' complete' : ''}`}>
              {answeredInCurrent}<span className="progress-total">/{currentQuestions.length}</span>
            </span>
            <span className="progress-label">respondidas</span>
          </div>
        </div>

        {/* Validation warning */}
        {showIncomplete && (
          <div className="validation-warning">
            <span className="validation-icon">⚠</span>
            <span>
              Responde todas las preguntas para continuar.{' '}
              {currentQuestions.length - answeredInCurrent === 1
                ? 'Falta 1 pregunta.'
                : `Faltan ${currentQuestions.length - answeredInCurrent} preguntas.`}
            </span>
          </div>
        )}

        {/* Questions */}
        {currentQuestions.map((question, qIdx) => {
          const isAnswered = answers[question.id] !== undefined
          const isError = showIncomplete && !isAnswered
          return (
            <div
              key={question.id}
              className={`question-card${isAnswered ? ' answered' : ''}${isError ? ' unanswered-error' : ''}`}
            >
              <div className="question-meta">
                <span className="question-number">{qIdx + 1}</span>
                {isAnswered && <span className="question-check">✓</span>}
              </div>
              <p className="question-text">{question.text}</p>
              <div className="likert-scale">
                {LIKERT_OPTIONS.map(option => (
                  <div key={option.value} className="likert-option">
                    <div
                      className={`likert-circle${answers[question.id] === option.value ? ' selected' : ''}`}
                      onClick={() => handleAnswerSelect(question.id, option.value)}
                      role="button"
                      aria-label={option.label}
                    >
                      {option.value}
                    </div>
                    <span className="likert-label">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Navigation ── */}
      <div className="test-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousCategory}
          disabled={currentCategory === 0}
        >
          ← Anterior
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNextCategory}
        >
          {currentCategory === categories.length - 1 ? 'Finalizar test ✓' : 'Siguiente →'}
        </button>
      </div>

    </div>
  )
}