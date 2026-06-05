import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Lock, AlertCircle } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: 'Bienvenida a MindAware',
      subtitle: 'Entiende tu relación con la tecnología y recupérala.',
      content: 'Una herramienta diseñada para quienes buscan un equilibrio digital saludable – sin culpa, sin alarmismo, con datos reales.',
      link: '/about',
      linkText: 'Explorar esta sección',
      image: 'Mindaware-background.jpg', 
    },
    {
      title: 'Recursos educativos',
      subtitle: 'Aprende sobre bienestar digital',
      content: 'Accede a una biblioteca completa de artículos, aplicaciones y libros sobre bienestar digital. Contenido curado por expertos para tu crecimiento personal.',
      link: '/recommendations',
      linkText: 'Explorar recursos',
      image: 'https://wpvip.edutopia.org/wp-content/uploads/2022/10/rayl-169hero-oeresource-shutterstock.jpg?w=2880&quality=85',
    },
    {
      title: 'Consejos personalizados',
      subtitle: 'Recomendaciones adaptadas a ti',
      content: 'Obtén consejos personalizados basados en tu perfil digital para mejorar tu relación con la tecnología y reducir el estrés digital.',
      link: '/test',
      linkText: 'Hacer el test',
      image: 'https://wclovers.com/wp-content/uploads/2023/10/What-are-personalized-recommendations.png',
    },
    {
      title: 'Beneficios exclusivos',
      subtitle: 'Para usuarios registrados',
      content: 'Los usuarios registrados tienen acceso a análisis detallados, recomendaciones personalizadas y herramientas exclusivas para mejorar su bienestar digital.',
      link: '/register',
      linkText: 'Registrarse',
      image: 'exclusive-benefits.jpg', // Reemplaza con imagen real o usa placeholder
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + (slides.length + 1)) % (slides.length + 1));
  };

  return (
    <div className="home-container">
      {/* Sección de datos */}
      <section className="info-section">
        <h2>Datos que te pueden interesar</h2>
        <div className="data-grid">
          <div className="data-card">
            <Heart size={32} color="#4CAF50" />
            <h3>Salud y redes sociales</h3>
            <p>
              El uso de las redes sociales está directamente relacionado con un aumento de la ansiedad, la depresión y otros problemas de salud mental. Casi el 40% de los adultos admite que las redes sociales les hacen sentir solos o aislados.
            </p>
          </div>
          <div className="data-card">
            <Clock size={32} color="#2196F3" />
            <h3>Tiempo y tecnología</h3>
            <p>
              El tiempo promedio diario que se pasa en redes sociales a nivel mundial es de 2 horas y 31 minutos. La Generación Z pasa un promedio de 4 horas diarias en plataformas sociales, más que cualquier otro grupo de edad.
            </p>
          </div>
          <div className="data-card">
            <Lock size={32} color="#9C27B0" />
            <h3>Privacidad y datos personales</h3>
            <p>
              Cada minuto, más de 500.000 comentarios, fotos y mensajes son publicados, generando una enorme cantidad de datos personales que las plataformas utilizan para publicidad dirigida.
            </p>
          </div>
          <div className="data-card">
            <AlertCircle size={32} color="#FF5722" />
            <h3>Desinformación y desconfianza</h3>
            <p>
              Más del 60% de los adultos ha compartido alguna vez información sin verificar en redes sociales. Solo el 20% de los usuarios confía en que las noticias que ve en línea son precisas.
            </p>
          </div>
        </div>
      </section>

      {/* Sección explorar con carrusel */}
      <section className="explore-section">
        <h2>Explora MindAware</h2>
        <div className="carousel-container">
          {currentSlide === slides.length ? (
            <div className="carousel-slide video-slide">
              <iframe
                src="https://www.youtube.com/embed/C74amJRp730?start=487"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="carousel-slide">
              <div className="carousel-content">
                <h3>{slides[currentSlide].title}</h3>
                <div className="subtitle">{slides[currentSlide].subtitle}</div>
                <p>{slides[currentSlide].content}</p>
                {slides[currentSlide].link && (
                  <Link to={slides[currentSlide].link} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    {slides[currentSlide].linkText}
                  </Link>
                )}
              </div>
              <div className="carousel-image">
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
              </div>
            </div>
          )}
          <button onClick={handlePrev} className="carousel-control prev">‹</button>
          <button onClick={handleNext} className="carousel-control next">›</button>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="cta-section">
        <Link to="/test" className="btn btn-primary btn-large">
          Comenzar test
        </Link>
        <p className="cta-note">
          Tip: el test toma aproximadamente 5-7 minutos y podrás ver tus resultados al instante
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <p>Proyecto Final FP DAW creado por Cristina Gregorio Vidal</p>
          <p>© 2026. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};