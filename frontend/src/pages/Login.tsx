import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Brand panel */}
        <div className="auth-brand">
          <div className="auth-brand-logo-mark">MA</div>
          <h2 className="auth-brand-name">MindAware</h2>
          <p className="auth-brand-tagline">
            Tu compañero en el bienestar digital. Entiende cómo las redes sociales
            afectan a tu vida y recupera el control.
          </p>
          <ul className="auth-brand-list">
            <li>Test de autoconocimiento digital</li>
            <li>Diario de hábitos y bienestar</li>
            <li>Recursos personalizados</li>
            <li>Historial de progreso personal</li>
          </ul>
        </div>

        {/* Form panel */}
        <div className="auth-form-panel">
          <div className="auth-header">
            <h1>Iniciar sesión</h1>
            <p>Accede a tu panel personal de bienestar digital</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Escribe tu contraseña"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="auth-guest">
            <p>También puedes:</p>
            <Link to="/test" className="btn btn-outline">
              Realizar Test como Invitado
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}