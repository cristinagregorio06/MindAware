import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('🔍 Main.tsx ejecutándose...')

const rootElement = document.getElementById('root')
console.log('🔍 Elemento root encontrado:', rootElement)

if (rootElement) {
  console.log('🔍 Intentando montar React...')
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  console.log('✅ React montado exitosamente')
} else {
  console.error('❌ No se encontró el elemento root!')
  document.body.innerHTML = '<h1>ERROR: No se encontró el elemento root</h1>'
}
