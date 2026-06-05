import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export const Register: React.FC = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      await register(email, password, nombre)
      // If register returns a session → go to dashboard directly
      // If email confirmation is required → show success message and redirect to login
      setMessage('¡Cuenta creada! Redirigiendo...')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado. Inténtalo de nuevo.'
      // Surface friendly messages for common backend errors
      if (
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('ya registrado') ||
        msg.toLowerCase().includes('ya existe una cuenta')
      ) {
        setError('Este email ya está registrado. ¿Quieres iniciar sesión?')
      } else {
        setError(msg)
      }
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
            Crea tu cuenta y empieza a entender tu relación con la tecnología.
            Tus datos, siempre seguros y solo tuyos.
          </p>
          <ul className="auth-brand-list">
            <li>Datos cifrados y privados</li>
            <li>Sin publicidad ni rastreo</li>
            <li>Acceso completo sin coste</li>
            <li>Cancela cuando quieras</li>
          </ul>
        </div>

        {/* Form panel */}
        <div className="auth-form-panel">
          <div className="auth-header">
            <h1>Crear cuenta</h1>
            <p>Únete a MindAware y comienza tu viaje hacia un mejor bienestar digital</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre"
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-full btn-animated"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="auth-terms">
            <p>
              Al registrarte, aceptas que tus datos se manejen de forma segura y privada. 
              No compartimos información personal con terceros.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}