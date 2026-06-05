import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  BookOpen,
  LogIn,
  UserPlus,
  LogOut,
  Moon,
  Sun
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navigation.css'
import logo from '/MindAware.png'

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="MindAware" className="logo-image" />
        </Link>
        
        <div className="nav-menu">
          {!user && (
            <Link to="/" className="nav-link">
              <span className="nav-icon home-icon">
                <Home size={18} />
              </span>
              Inicio
            </Link>
          )}
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon dashboard-icon">
                  <LayoutDashboard size={18} />
                </span>
                Dashboard
              </Link>
              
              <Link to="/diary" className="nav-link">
                <span className="nav-icon diary-icon">
                  <BookOpen size={18} />
                </span>
                Mi Diario
              </Link>
              
              <button onClick={handleLogout} className="nav-button logout">
                <span className="nav-icon logout-icon">
                  <LogOut size={18} />
                </span>
                Cerrar sesión
              </button>
              <button onClick={() => navigate('/delete-account')} className="nav-button delete-account">
                <span className="nav-icon delete-account-icon">
                  <LogOut size={18} />
                </span>
                Eliminar cuenta
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button login">
                <span className="nav-icon login-icon">
                  <LogIn size={18} />
                </span>
                Iniciar sesión
              </Link>
              
              <Link to="/register" className="nav-button register">
                <span className="nav-icon register-icon">
                  <UserPlus size={18} />
                </span>
                Registro
              </Link>
            </>
          )}
        </div>
      </div>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </nav>
  )
}