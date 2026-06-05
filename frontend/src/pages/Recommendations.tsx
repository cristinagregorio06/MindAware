import React, { useState } from 'react';
import {
  Smartphone,
  BookOpen,
  Video,
  Dumbbell,
  Sparkles,
  Heart,
  Clock,
  Lock,
  AlertCircle,
  Brain,
  Users,
  Globe,
  Zap,
  Flower2
} from 'lucide-react';
import './Recommendations.css';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'app' | 'article' | 'video' | 'exercise';
  url?: string;
  category: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const Recommendations: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Recursos completos (apps, artículos, videos + NUEVOS EJERCICIOS)
  const resources: Resource[] = [
    // ========== APPS (ids 1-4) ==========
    {
      id: 1,
      title: 'Forest: Focus for Productivity',
      description: 'Aplicación que te ayuda a concentrarte plantando árboles virtuales. Ideal para reducir la distracción digital.',
      type: 'app',
      category: ['digital_anxiety', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 2,
      title: 'Headspace: Meditación y Mindfulness',
      description: 'Ejercicios de meditación guiada para reducir el estrés y mejorar el bienestar mental.',
      type: 'app',
      category: ['digital_anxiety', 'depression', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 3,
      title: 'RescueTime: Seguimiento de Tiempo Digital',
      description: 'Monitorea automáticamente tu tiempo de pantalla y te ayuda a entender tus patrones de uso.',
      type: 'app',
      category: ['digital_anxiety', 'information_panic'],
      difficulty: 'intermediate'
    },
    {
      id: 4,
      title: 'Moment: Tiempo de Pantalla',
      description: 'Rastrea tu uso del teléfono y te ayuda a establecer límites saludables.',
      type: 'app',
      category: ['digital_anxiety', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    // ========== ARTÍCULOS (ids 5-8) ==========
    {
      id: 5,
      title: 'Cómo Crear Límites Digitales Saludables',
      description: 'Guía práctica para establecer horarios y espacios libres de tecnología en tu vida diaria.',
      type: 'article',
      category: ['life_satisfaction', 'digital_anxiety'],
      difficulty: 'beginner'
    },
    {
      id: 6,
      title: 'El Impacto de las Redes Sociales en la Autoestima',
      description: 'Artículo científico sobre cómo las plataformas digitales afectan nuestra percepción personal.',
      type: 'article',
      category: ['digital_self_esteem', 'digital_loneliness'],
      difficulty: 'intermediate'
    },
    {
      id: 7,
      title: 'Técnicas de Desintoxicación Digital',
      description: 'Métodos efectivos para reducir la dependencia tecnológica sin perder productividad.',
      type: 'article',
      category: ['digital_anxiety', 'depression'],
      difficulty: 'intermediate'
    },
    {
      id: 8,
      title: 'Mindfulness en la Era Digital',
      description: 'Cómo practicar la atención plena mientras navegamos en un mundo hiperconectado.',
      type: 'article',
      category: ['digital_anxiety', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    // ========== VIDEOS (ids 9-11) ==========
    {
      id: 9,
      title: 'TED Talk: Cómo la Tecnología Está Secuestrando tu Mente',
      description: 'Charla reveladora sobre los mecanismos de adicción digital y cómo recuperar control.',
      type: 'video',
      category: ['digital_anxiety', 'information_panic'],
      difficulty: 'intermediate'
    },
    {
      id: 10,
      title: 'Documental: El Dilema Social',
      description: 'Análisis profundo del impacto de las redes sociales en la sociedad y salud mental.',
      type: 'video',
      category: ['digital_self_esteem', 'digital_loneliness', 'information_panic'],
      difficulty: 'advanced'
    },
    {
      id: 11,
      title: 'Masterclass: Bienestar Digital para Principiantes',
      description: 'Curso introductorio sobre hábitos digitales saludables y autocuidado online.',
      type: 'video',
      category: ['life_satisfaction', 'future_confidence'],
      difficulty: 'beginner'
    },
    // ========== NUEVOS EJERCICIOS (ids 12-32) ==========
    // Basados en mindfulness, gestión del tiempo, desafíos de desconexión, reemplazo saludable, reflexión y ansiedad por redes.
    {
      id: 12,
      title: 'Ejercicio T.I.M.E. (Time, Intention, Mindfulness, Emotion)',
      description: 'Antes de conectarte, pregúntate: ¿Cuánto tiempo quiero dedicar? ¿Cuál es mi intención? ¿Actúo con conciencia? ¿Cómo me siente? Un mini ritual para empezar con propósito.',
      type: 'exercise',
      category: ['digital_anxiety', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 13,
      title: 'Pausa de la Notificación Sensorial',
      description: 'Cuando sientas el impulso de revisar el móvil, detente. Observa un objeto natural, escucha tres sonidos ambientales o toca una textura cercana. Reconecta con el mundo real.',
      type: 'exercise',
      category: ['digital_anxiety', 'digital_loneliness'],
      difficulty: 'beginner'
    },
    {
      id: 14,
      title: 'Elecciones Conscientes de Medios',
      description: 'Antes, durante y después de usar una pantalla, reflexiona: ¿Me hace feliz o me entristece? ¿Me ayuda o interfiere? Respira profundo y conecta con tu emoción.',
      type: 'exercise',
      category: ['digital_self_esteem', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 15,
      title: 'Regla 20-20-20 para la Salud Visual',
      description: 'Cada 20 minutos, mira un punto a 6 metros de distancia durante al menos 20 segundos. Alivia la fatiga visual y te ayuda a tomar micro-pausas conscientes.',
      type: 'exercise',
      category: ['life_satisfaction', 'digital_anxiety'],
      difficulty: 'beginner'
    },
    {
      id: 16,
      title: 'Metas SMART Digitales',
      description: 'Define un objetivo concreto: "Esta semana limitaré Instagram a 30 min/día usando el temporizador". Específico, Medible, Alcanzable, Relevante y con Tiempo definido.',
      type: 'exercise',
      category: ['future_confidence', 'life_satisfaction'],
      difficulty: 'intermediate'
    },
    {
      id: 17,
      title: 'Toques de Queda Tecnológicos',
      description: 'Establece dos momentos libres de pantallas: la primera hora tras despertar y la hora antes de dormir. Úsalos para leer, meditar o conversar sin dispositivos.',
      type: 'exercise',
      category: ['digital_anxiety', 'depression'],
      difficulty: 'beginner'
    },
    {
      id: 18,
      title: 'Desafío: 10 Días Sin Redes Sociales',
      description: 'Aléjate completamente de las plataformas sociales por diez días. Sustituye ese tiempo con caminatas, lectura o yoga. Observa cambios en tu ansiedad y sueño.',
      type: 'exercise',
      category: ['digital_anxiety', 'digital_loneliness', 'life_satisfaction'],
      difficulty: 'advanced'
    },
    {
      id: 19,
      title: 'Día de Conexión Real (Avanzado)',
      description: 'Dedica un día entero a interacciones cara a cara. Apaga notificaciones y planifica actividades con amigos o familia. Documenta cómo te sientes al final.',
      type: 'exercise',
      category: ['digital_loneliness', 'future_confidence'],
      difficulty: 'advanced'
    },
    {
      id: 20,
      title: 'Sabbatical Digital Programado',
      description: 'Elige un día a la semana o un fin de semana al mes para desconectar de todos los dispositivos no esenciales. Usa ese tiempo para resetear tu sistema nervioso.',
      type: 'exercise',
      category: ['digital_anxiety', 'future_confidence'],
      difficulty: 'advanced'
    },
    {
      id: 21,
      title: 'Salidas a la Naturaleza para Resetear',
      description: 'Sustituye 30 minutos de pantallas por tiempo al aire libre. Camina por un parque, toca el césped o mira el cielo. Reduce el cortisol y mejora el estado de ánimo.',
      type: 'exercise',
      category: ['depression', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 22,
      title: 'Lectura de Libros Físicos',
      description: 'Cambia la lectura en pantalla por un libro de papel durante al menos 20 minutos al día. Mejora la concentración y te ayuda a desconectar.',
      type: 'exercise',
      category: ['life_satisfaction', 'digital_anxiety'],
      difficulty: 'beginner'
    },
    {
      id: 23,
      title: 'Prácticas Creativas Offline',
      description: 'Dibuja, pinta, escribe a mano o toca un instrumento durante 15 minutos. Estas actividades estimulan la intuición y reducen la dependencia digital.',
      type: 'exercise',
      category: ['life_satisfaction', 'digital_self_esteem'],
      difficulty: 'intermediate'
    },
    {
      id: 24,
      title: 'Diario de Gratitud Digital',
      description: 'Cada noche, escribe 3 cosas positivas que la tecnología te aportó y 3 que te quitó. Evalúa el verdadero impacto de tu uso digital.',
      type: 'exercise',
      category: ['digital_self_esteem', 'life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 25,
      title: 'Auditoría Digital Personal',
      description: 'Dedica 15 minutos a revisar tus apps. Pregúntate: ¿Cuáles uso más? ¿Cómo me hacen sentir? Elimina o restringe las que generen emociones negativas.',
      type: 'exercise',
      category: ['digital_self_esteem', 'digital_anxiety'],
      difficulty: 'beginner'
    },
    {
      id: 26,
      title: 'Hoja de Trabajo "Mi Bienestar Digital"',
      description: 'Responde preguntas guiadas sobre cómo te hace sentir Internet, qué actividades te gustan y cuáles te generan estrés. Ideal para autoconocimiento.',
      type: 'exercise',
      category: ['digital_self_esteem', 'digital_anxiety'],
      difficulty: 'beginner'
    },
    {
      id: 27,
      title: 'Desactiva Notificaciones No Esenciales',
      description: 'Revisa tus notificaciones y desactiva todas las que no sean urgentes. Deja solo las de mensajes personales o recordatorios importantes. Reduce interrupciones.',
      type: 'exercise',
      category: ['digital_anxiety', 'information_panic'],
      difficulty: 'beginner'
    },
    {
      id: 28,
      title: 'Crea una Zona Libre de Dispositivos',
      description: 'Define un espacio en tu hogar (dormitorio o comedor) donde esté prohibido usar el móvil o la tablet. Úsalo para descansar o compartir en familia.',
      type: 'exercise',
      category: ['life_satisfaction', 'digital_anxiety'],
      difficulty: 'intermediate'
    },
    {
      id: 29,
      title: 'Cuida tu Postura Digital',
      description: 'Cuando uses el móvil más de 15 minutos, levántalo a la altura de los ojos. Apoya los brazos sobre una almohada en tu regazo para evitar tensión en cuello y espalda.',
      type: 'exercise',
      category: ['life_satisfaction'],
      difficulty: 'beginner'
    },
    {
      id: 30,
      title: 'Método "Appstinence" de la Universidad de Harvard',
      description: 'Sigue 5 pasos: realiza actividades presenciales sin móvil, lleva un registro de tiempo de uso, evita el móvil 2 horas antes de dormir, desactiva notificaciones y establece días de descanso digital.',
      type: 'exercise',
      category: ['digital_anxiety', 'future_confidence'],
      difficulty: 'intermediate'
    },
    {
      id: 31,
      title: 'Semana de Interacción Consciente en Redes Sociales',
      description: 'Durante una semana, anota tu tiempo de pantalla y cómo te sientes emocionalmente después de usar cada plataforma. Ajusta tus hábitos según tus observaciones.',
      type: 'exercise',
      category: ['digital_self_esteem', 'digital_loneliness'],
      difficulty: 'intermediate'
    },
    {
      id: 32,
      title: 'Curación Consciente de tu Feed',
      description: 'Revisa a quién sigues. Pregúntate: ¿Me inspira o me genera comparación y estrés? Deja de seguir o silencia cuentas que no contribuyan a tu bienestar.',
      type: 'exercise',
      category: ['digital_self_esteem', 'digital_anxiety'],
      difficulty: 'beginner'
    }
  ];

  // Mapeo de tipos a iconos y colores (fondo del icono)
  const typeConfig = {
    app: {
      icon: <Smartphone size={24} />,
      label: 'Aplicación',
      color: '#A7C4A0' // verde claro
    },
    article: {
      icon: <BookOpen size={24} />,
      label: 'Artículo',
      color: '#7B9E87' // verde medio
    },
    video: {
      icon: <Video size={24} />,
      label: 'Video',
      color: '#C6E2DC' // verde menta
    },
    exercise: {
      icon: <Dumbbell size={24} />,
      label: 'Ejercicio',
      color: '#546C67' // verde oscuro
    }
  };

  // Opciones de filtro por tipo (con iconos)
  const resourceTypes = [
    { value: 'all', label: 'Todos', icon: <Sparkles size={18} /> },
    { value: 'app', label: 'Aplicaciones', icon: <Smartphone size={18} /> },
    { value: 'article', label: 'Artículos', icon: <BookOpen size={18} /> },
    { value: 'video', label: 'Videos', icon: <Video size={18} /> },
    { value: 'exercise', label: 'Ejercicios', icon: <Dumbbell size={18} /> }
  ];

  // Categorías (para filtro y etiquetas)
  const categories = [
    { value: 'all', label: 'Todas las áreas', icon: <Globe size={16} /> },
    { value: 'digital_self_esteem', label: 'Autoestima Digital', icon: <Heart size={16} /> },
    { value: 'digital_loneliness', label: 'Soledad Digital', icon: <Users size={16} /> },
    { value: 'digital_anxiety', label: 'Ansiedad Digital', icon: <Zap size={16} /> },
    { value: 'depression', label: 'Estado de Ánimo', icon: <Flower2 size={16} /> },
    { value: 'information_panic', label: 'Sobrecarga Informativa', icon: <AlertCircle size={16} /> },
    { value: 'life_satisfaction', label: 'Satisfacción Vital', icon: <Brain size={16} /> },
    { value: 'future_confidence', label: 'Confianza en el Futuro', icon: <Clock size={16} /> }
  ];

  // Filtrar recursos
  const filteredResources = resources.filter(resource => {
    const typeMatch = selectedType === 'all' || resource.type === selectedType;
    const categoryMatch = selectedCategory === 'all' || resource.category.includes(selectedCategory);
    return typeMatch && categoryMatch;
  });

  // Obtener color según dificultad
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981'; // verde
      case 'intermediate': return '#F59E0B'; // naranja
      case 'advanced': return '#EF4444'; // rojo
      default: return '#6B7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return difficulty;
    }
  };

  // Función para obtener etiqueta de categoría a partir de su valor
  const getCategoryLabel = (catValue: string) => {
    const found = categories.find(c => c.value === catValue);
    return found ? found.label : catValue;
  };

  return (
    <div className="recommendations">
      <div className="recommendations-header">
        <h1>Recursos para tu Bienestar Digital</h1>
        <p>Descubre herramientas, ejercicios y contenido curado para mejorar tu relación con la tecnología</p>
      </div>

      {/* Filtros */}
      <div className="filters">
        <div className="filter-group">
          <h3>Tipo de recurso</h3>
          <div className="filter-options">
            {resourceTypes.map(type => (
              <button
                key={type.value}
                className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
                onClick={() => setSelectedType(type.value)}
              >
                <span className="filter-icon">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Área de enfoque</h3>
          <div className="filter-options">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={`filter-btn filter-category ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span className="filter-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="resources-count">
        <p>Mostrando {filteredResources.length} recursos</p>
      </div>

      {/* Grid de tarjetas */}
      <div className="resources-grid">
        {filteredResources.map(resource => {
          const typeConf = typeConfig[resource.type];
          return (
            <div key={resource.id} className="resource-card">
              <div className="resource-header">
                <div className="resource-icon" style={{ backgroundColor: typeConf.color }}>
                  {typeConf.icon}
                </div>
                <div
                  className="resource-difficulty"
                  style={{ backgroundColor: getDifficultyColor(resource.difficulty) }}
                >
                  {getDifficultyLabel(resource.difficulty)}
                </div>
              </div>

              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>

              <div className="resource-categories">
                {resource.category.slice(0, 2).map(cat => (
                  <span key={cat} className="category-tag">
                    {getCategoryLabel(cat)}
                  </span>
                ))}
                {resource.category.length > 2 && (
                  <span className="category-tag more">
                    +{resource.category.length - 2} más
                  </span>
                )}
              </div>

              <div className="resource-actions">
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    {resource.type === 'app' ? 'Descargar' :
                     resource.type === 'video' ? 'Ver video' :
                     resource.type === 'article' ? 'Leer artículo' : 'Ver detalles'}
                  </a>
                ) : (
                  <button className="btn btn-outline">
                    {resource.type === 'exercise' ? 'Probar ejercicio' : 'Más info'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredResources.length === 0 && (
        <div className="no-resources">
          <div className="no-resources-icon">🔍</div>
          <h2>No se encontraron recursos</h2>
          <p>Prueba cambiando los filtros o explora todas las categorías</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedType('all');
              setSelectedCategory('all');
            }}
          >
            Mostrar todos los recursos
          </button>
        </div>
      )}

      {/* Footer informativo */}
      <div className="recommendations-footer">
        <div className="footer-note">
          <h3>¿Necesitas ayuda personalizada?</h3>
          <p>
            Estos recursos son sugerencias generales. Si experimentas dificultades significativas
            con tu bienestar digital o mental, considera consultar con un profesional de la salud.
          </p>
        </div>
      </div>
    </div>
  );
};