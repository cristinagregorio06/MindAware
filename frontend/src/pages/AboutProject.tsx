import React from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  Brain,
  Smartphone,
  Shield,
  Code2,
  GraduationCap,
  Lightbulb,
  Users,
  ArrowRight,
  Zap,
  TrendingUp,
  CloudRain,
  AlertTriangle,
  Target,
  WifiOff,
  ChevronDown,
} from 'lucide-react'
import './AboutProject.css'

export const AboutProject: React.FC = () => {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <header className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">Proyecto Final FP DAW 2026</span>
          <h1>MindAware</h1>
          <p className="about-hero-subtitle">
            Entiende tu relación con la tecnología y recupérala.
          </p>
          <p className="about-hero-tagline">
            Una herramienta diseñada para quienes buscan un equilibrio digital saludable
            &nbsp;&ndash;&nbsp;sin culpa, sin alarmismo, con datos reales.
          </p>
        </div>
      </header>

      {/* ── Quote ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-author-card">
            <p style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.25rem' }}>
              &ldquo;Si algo es gratis, el producto eres tú.&rdquo;
            </p>
            <p>
              Esta frase resume el modelo de negocio que sustenta a las grandes plataformas sociales.
              Cuando no pagas por un servicio, la moneda de cambio eres tú: tu atención, tu tiempo,
              tus datos y, en última instancia, tu comportamiento. Las redes sociales no son gratuitas;
              tienen un coste invisible que se mide en horas robadas, en autoestima erosionada y en
              privacidad cedida sin apenas leerlo en los términos y condiciones.
            </p>
            <p style={{ marginBottom: 0 }}>
              Entender esto no significa abandonar la tecnología. Significa relacionarse con ella desde
              la conciencia, sabiendo qué te ofrece y qué te quita. De esa toma de conciencia nació MindAware.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sobre el proyecto ── */}
      <section className="about-section about-section--alt">
        <div className="about-section-inner">
          <div className="about-icon-title">
            <GraduationCap size={28} className="about-icon" />
            <h2>Sobre el proyecto</h2>
          </div>
          <p>
            MindAware es el proyecto final del ciclo formativo de grado superior de
            <strong> Desarrollo de Aplicaciones Web (DAW)</strong>. Surge de la necesidad de crear
            algo que no solo demuestre competencia técnica, sino que tenga un impacto real en quien lo use.
          </p>
          <p>
            <strong>El bienestar digital</strong> es la capacidad de usar las tecnologías de forma que
            proteja nuestra salud física, mental y social. No es un concepto abstracto: se concreta en
            cómo nos sentimos después de abrir Instagram, en cuánto tiempo llevamos mirando el móvil
            sin darnos cuenta, en si las redes nos conectan de verdad o solo simulan hacerlo.
          </p>
          <p>
            Las plataformas sociales están diseñadas para maximizar el tiempo que pasamos dentro de
            ellas, no para hacernos sentir bien. Esto tiene consecuencias directas en las siete
            categorías que el test de MindAware analiza:
          </p>
          <ul className="about-category-list">
            <li>
              <span className="about-category-icon"><Zap size={18} /></span>
              <div>
                <strong>Ansiedad</strong> — El FOMO, las notificaciones continuas y la presión
                de estar siempre disponible activan de forma sostenida nuestro sistema de alerta,
                generando un estado de hipervigilancia difícil de apagar.
              </div>
            </li>
            <li>
              <span className="about-category-icon"><Heart size={18} /></span>
              <div>
                <strong>Autoestima</strong> — La comparación constante con vidas filtradas y
                la dependencia de los &ldquo;likes&rdquo; como validación distorsiona la percepción
                de una misma y genera insatisfacción crónica.
              </div>
            </li>
            <li>
              <span className="about-category-icon"><TrendingUp size={18} /></span>
              <div>
                <strong>Confianza en el futuro</strong> — El consumo masivo de noticias negativas y
                narrativas de crisis puede erosionar la sensación de que el futuro es habitable,
                afectando a la motivación y la capacidad de planificar.
              </div>
            </li>
            <li>
              <span className="about-category-icon"><CloudRain size={18} /></span>
              <div>
                <strong>Depresión y desánimo</strong> — El uso pasivo de redes sociales se asocia con
                mayor rumiación, sensación de vacío y pérdida de interés por actividades offline que
                antes resultaban satisfactorias.
              </div>
            </li>
            <li>
              <span className="about-category-icon"><AlertTriangle size={18} /></span>
              <div>
                <strong>Pánico informativo</strong> — La sobreexposición a contenido alarmista y la
                dificultad para distinguir lo verdadero de lo falso generan una sensación de amenaza
                constante que agota emocionalmente.
              </div>
            </li>
            <li>
              <span className="about-category-icon"><Target size={18} /></span>
              <div>
                <strong>Satisfacción vital</strong> — El scroll infinito y el consumo pasivo vacían el
                sentido de propósito; cuanto más tiempo se pasa consumiendo la vida de otros, menos
                espacio queda para construir la propia.
              </div>
            </li>
            <li>
              <span className="about-category-icon"><WifiOff size={18} /></span>
              <div>
                <strong>Soledad digital</strong> — La paradoja de la conectividad: cuanto más tiempo
                pasamos en pantalla, más solos nos sentimos en la vida real. Los vínculos superficiales
                no sustituyen la conexión genuina.
              </div>
            </li>
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            MindAware nació como respuesta práctica a todo esto. El objetivo es devolverte
            la perspectiva, ayudarte a medir lo que sientes y darte herramientas concretas para mejorar.
          </p>
          <div className="about-notice">
            <strong>Nota importante:</strong> MindAware es un proyecto personal nacido del interés
            por los efectos de las redes sociales en nuestras vidas. No es un estudio científico ni
            una herramienta de diagnóstico clínico. Sus resultados son orientativos y no sustituyen
            en ningún caso la valoración de un profesional de la salud mental. Si crees que necesitas
            ayuda, no dudes en buscarla.
          </div>
        </div>
      </section>

      {/* ── Qué ofrece ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-icon-title">
            <h2>Qué ofrece MindAware</h2>
          </div>
          <div className="about-features-grid">
            <div className="about-feature-card">
              <Smartphone size={24} className="about-feature-icon" />
              <h3>Test de bienestar digital</h3>
              <p>Evalúa tu relación con la tecnología en áreas como autoestima digital, ansiedad, soledad y satisfacción vital.</p>
            </div>
            <div className="about-feature-card">
              <Brain size={24} className="about-feature-icon" />
              <h3>Dashboard personal</h3>
              <p>Visualiza tu evolución a lo largo del tiempo con gráficos claros y un historial de resultados.</p>
            </div>
            <div className="about-feature-card">
              <Heart size={24} className="about-feature-icon" />
              <h3>Diario de bienestar</h3>
              <p>Registra tu estado de ánimo diario, horas de uso del móvil y hábitos conseguidos para hacer un seguimiento real.</p>
            </div>
            <div className="about-feature-card">
              <Lightbulb size={24} className="about-feature-icon" />
              <h3>Recursos y recomendaciones</h3>
              <p>Una biblioteca curada de apps, artículos, vídeos y ejercicios para mejorar tu bienestar digital.</p>
            </div>
            <div className="about-feature-card">
              <Shield size={24} className="about-feature-icon" />
              <h3>Privacidad ante todo</h3>
              <p>Tus datos son tuyos. El diario se guarda localmente. El resto se gestiona con autenticación segura vía Supabase.</p>
            </div>
            <div className="about-feature-card">
              <Users size={24} className="about-feature-icon" />
              <h3>Para todo el mundo</h3>
              <p>Diseñado para cualquier persona que quiera relacionarse mejor con la tecnología.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tecnología (colapsable) ── */}
      <section className="about-section about-section--alt">
        <div className="about-section-inner">
          <details className="about-tech-details">
            <summary className="about-tech-summary">
              <span className="about-tech-summary-inner">
                <Code2 size={22} className="about-icon" />
                <span>Tecnología utilizada</span>
              </span>
              <ChevronDown size={18} className="about-tech-chevron" />
            </summary>
            <div className="about-tech-grid">
              {[
                { name: 'React 18', role: 'Interfaz de usuario' },
                { name: 'TypeScript', role: 'Tipado estático' },
                { name: 'Vite', role: 'Bundler y dev server' },
                { name: 'Node.js + Express', role: 'Backend API REST' },
                { name: 'Supabase', role: 'Base de datos y autenticación' },
                { name: 'Lucide React', role: 'Iconografía' },
                { name: 'CSS Variables', role: 'Design system y temas' },
                { name: 'Supabase (PostgreSQL)', role: 'Persistencia del diario' },
              ].map(tech => (
                <div key={tech.name} className="about-tech-item">
                  <span className="about-tech-name">{tech.name}</span>
                  <span className="about-tech-role">{tech.role}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="about-cta">
        <h2>¿Listo para empezar?</h2>
        <p>Haz el test y descubre tu perfil de bienestar digital en menos de 10 minutos.</p>
        <div className="about-cta-buttons">
          <Link to="/test" className="btn btn-primary about-btn">
            Comenzar el test <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn btn-secondary about-btn">
            Crear cuenta
          </Link>
        </div>
      </section>

    </div>
  )
}
