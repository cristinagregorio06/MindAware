import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import * as api from '../api/apiService'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string
  email: string
  nombre?: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nombre: string) => Promise<void>
  logout: () => void
  /** Fetch wrapper that auto-refreshes the token on 401 before giving up */
  apiFetch: (input: string, init?: RequestInit) => Promise<Response>
  /** Try to refresh the access token using the stored refresh token */
  tryRefresh: () => Promise<string | null>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const saveSession = (newUser: AuthUser, newToken: string, newRefresh: string) => {
    sessionStorage.setItem('mindaware_token', newToken)
    sessionStorage.setItem('mindaware_refresh', newRefresh)
    sessionStorage.setItem('mindaware_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const clearSession = () => {
    sessionStorage.removeItem('mindaware_token')
    sessionStorage.removeItem('mindaware_refresh')
    sessionStorage.removeItem('mindaware_user')
    setToken(null)
    setUser(null)
  }

  // Try to refresh the access token using the stored refresh token
  const tryRefresh = useCallback(async (): Promise<string | null> => {
    const storedRefresh = sessionStorage.getItem('mindaware_refresh')
    if (!storedRefresh) return null

    try {
      const data = await api.refreshToken(storedRefresh)
      const newToken: string = data.session.access_token
      const newRefresh: string = data.session.refresh_token
      const nombre = data.user?.user_metadata?.nombre || undefined
      const currentUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        nombre,
      }
      saveSession(currentUser, newToken, newRefresh)
      return newToken
    } catch {
      clearSession()
      return null
    }
  }, [])

  // Restore session from sessionStorage on mount; refresh token if already expired
  useEffect(() => {
    const storedToken = sessionStorage.getItem('mindaware_token')
    const storedUser = sessionStorage.getItem('mindaware_user')

    if (storedToken && storedUser) {
      // Decode JWT to check expiry without a library
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        const expired = payload.exp && payload.exp * 1000 < Date.now()
        if (expired) {
          // Silently refresh before rendering protected content
          tryRefresh().finally(() => setIsLoading(false))
          return
        }
      } catch {
        // Malformed token – clear it
        clearSession()
        setIsLoading(false)
        return
      }
      setToken(storedToken)
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      // Silently refresh to get the latest user data (including nombre)
      tryRefresh()
    }
    setIsLoading(false)
  }, [tryRefresh])

  // Fetch wrapper: injects Authorization header, retries once after token refresh on 401
  const apiFetch = useCallback(async (input: string, init: RequestInit = {}): Promise<Response> => {
    const currentToken = sessionStorage.getItem('mindaware_token')
    const headers = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    }

    let res = await fetch(input, { ...init, headers })

    if (res.status === 401) {
      // Token expired – try to silently refresh and retry once
      const newToken = await tryRefresh()
      if (newToken) {
        res = await fetch(input, {
          ...init,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        })
      }
    }

    return res
  }, [tryRefresh])

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    const nombre = data.user?.user_metadata?.nombre || undefined
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      nombre,
    }
    saveSession(authUser, data.session.access_token, data.session.refresh_token)
  }

  const register = async (email: string, password: string, nombre: string) => {
    const data = await api.register(email, password, nombre)
    if (data.session) {
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        nombre,
      }
      saveSession(authUser, data.session.access_token, data.session.refresh_token)
    }
  }

  const logout = () => {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, apiFetch, tryRefresh }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
