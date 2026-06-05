import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Wait until the auth state is restored from localStorage
  if (isLoading) {
    return <div className="loading-screen">Cargando...</div>
  }

  if (!user) {
    // Redirect to login, preserving the page the user tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
