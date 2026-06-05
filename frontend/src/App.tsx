// MINDAWARE - Aplicación Completa de Bienestar Digital
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { Test } from './pages/Test'
import { Results } from './pages/Results'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Recommendations } from './pages/Recommendations'
import { Diary } from './pages/Diary'
import { AboutProject } from './pages/AboutProject'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutProject />} />
              <Route path="/test" element={<Test />} />
              <Route path="/results" element={<Results />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={<Recommendations />}
              />
              <Route
                path="/diary"
                element={
                  <ProtectedRoute>
                    <Diary />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App


