import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiLocationMarker, HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { API_ENDPOINTS, apiCall } from '../../config/api';

const baseUrl = import.meta.env.PROD ? "https://api.azaklaryapi.com" : "http://localhost:5177";

// Resim yükleme komponenti
const ImageLoader = ({ src, alt, fallbackSrc, className }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    setImageError(true);
  };

  useEffect(() => {
    setCurrentSrc(src);
    setImageError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {!imageError && (
        <img
          src={currentSrc}
          alt={alt}
          className={className}
          onError={handleError}
        />
      )}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Resim bulunamadı</div>
        </div>
      )}
    </div>
  );
};

const FeaturedProjects = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await apiCall(`${API_ENDPOINTS.PROJECTS}`);
        
        // apiCall fonksiyonu response'u wrap ediyor, bu yüzden result.data.data şeklinde erişmemiz gerekiyor
        const projectsData = result.data?.data || result.data;
        
        if (result.success && projectsData && Array.isArray(projectsData)) {
          // Son 4 projeyi al
          const lastFourProjects = projectsData.slice(-4);
          setProjects(lastFourProjects);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    fetchProjects();
  }, []);

  const getCategoryColor = (status) => {
    switch (status) {
      case 2: return '#10b981'; // Tamamlanan
      case 1: return '#f59e0b'; // Devam Eden
      case 3: return '#8b5cf6'; // Gelecek
      default: return '#6b7280';
    }
  };

  // Mobil kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Slider fonksiyonları
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Touch/Swipe fonksiyonları
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Auto-play için
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobile, projects.length]);

  return (
    <section className="section-padding section-white">
      <div className="container-custom">
        {/* Başlık */}
        <div className="section-header">
          <h2 className="heading-secondary">Projelerimiz</h2>
          <p className="text-lead">
            Kaliteli işçilik ve modern tasarım anlayışımızla hayata geçirdiğimiz projelerimize göz atın.
          </p>
        </div>
        {/* Desktop Projeler Grid */}
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project.id} className="project-card">
              <Link to={`/proje/${project.slug}`}>
                {/* Proje Resmi */}
                <div className="project-image-container">
                  <ImageLoader
                    src={`${baseUrl}${project.images && project.images.length > 0 ? project.images[0] : ''}`}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-overlay" />
                  
                  {/* Kategori Badge */}
                  <div className="project-category">
                    {project.category}
                  </div>

                  {/* Lokasyon ve Tarih Bilgileri */}
                  <div className="project-info-overlay">
                    <div className="project-location">
                      <HiLocationMarker />
                      <span>{project.location}</span>
                    </div>
                    <div className="project-location">
                      <HiCalendar />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>

                {/* Proje Detayları */}
                <div className="project-details">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  {/* İstatistikler */}
                  {project.stats && project.stats.length > 0 && (
                    <div className="project-stats">
                      {project.stats.slice(0, 3).map((stat, statIndex) => (
                        <div key={statIndex} className="stat">
                          <div className="stat-value">
                            {stat.value}{stat.unit}
                          </div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detay Linki */}
                  <div className="project-link">
                    Detayları Gör
                    <HiArrowRight />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Projeler Slider */}
        <div className="projects-slider-container">
          <div 
            ref={sliderRef}
            className="projects-slider"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${projects.length * 100}%`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((project, index) => (
              <div key={project.id} className="projects-slide">
                <Link 
                  to={`/proje/${project.slug}`}
                  className="project-card"
                >
                  <div className="project-image-container">
                    {/* Proje Resmi */}
                    <ImageLoader
                      src={`${baseUrl}${project.images && project.images.length > 0 ? project.images[0] : ''}`}
                      alt={project.title}
                      className="project-image"
                    />
                    <div className="project-overlay" />
                    
                    {/* Kategori Badge */}
                    <div 
                      className="project-category"
                      style={{ backgroundColor: getCategoryColor(project.status) }}
                    >
                      {project.category}
                    </div>
                    
                    {/* Overlay Bilgiler */}
                    <div className="project-info-overlay">
                      <div className="project-location">
                        <HiLocationMarker />
                        <span>{project.location}</span>
                      </div>
                      <div className="project-year">
                        <HiCalendar />
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proje Detayları */}
                  <div className="project-details">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    
                    {/* İstatistikler */}
                    <div className="project-stats">
                      {project.stats.map((stat, idx) => (
                        <div key={idx} className="stat">
                          <div className="stat-value">{stat.value}{stat.unit}</div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Detay Butonu */}
                    <div className="project-link">
                      Detayları Gör
                      <HiArrowRight />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <div className="slider-controls">
            <button 
              className="slider-arrow" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <HiChevronLeft />
            </button>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            
            <button 
              className="slider-arrow" 
              onClick={nextSlide}
              disabled={currentSlide === projects.length - 1}
            >
              <HiChevronRight />
            </button>
          </div>
        </div>

        {/* Tüm Projeler Butonu */}
        <div className="section-cta" style={{ marginTop: '60px' }}>
          <Link to="/projeler" className="btn btn-primary btn-large">
            Tüm Projeleri Görüntüle
            <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects; 