import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiLocationMarker, HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const FeaturedProjects = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: 'Bahçelievler',
      location: 'Bahçelievler, İstanbul',
      year: '2024',
      category: 'Tamamlanan',
      status: 'completed',
      description: 'Bahçelievler bölgesindeki modern konut projemiz. Detaylı bilgiler yakında eklenecektir.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80',
      stats: [
        { value: '---', label: 'İnşaat Alanı', unit: 'm²' },
        { value: '---', label: 'Daire', unit: '' },
        { value: '---', label: 'Kat', unit: '' }
      ]
    },
    {
      id: 2,
      title: 'Haznedar Park',
      location: 'Güngören, İstanbul',
      year: '2023',
      category: 'Tamamlanan',
      status: 'completed',
      description: 'Güngören\'in en merkezi konumunda park ve İSPARK kapalı otoparka cepheli modern konut projesi. 2 blok halinde tasarlanan yapımızda toplamda 16 daire bulunmaktadır.',
      image: '/assets/haznedar_park/26.jpg',
      stats: [
        { value: '6500', label: 'İnşaat Alanı', unit: 'm²' },
        { value: '16', label: 'Daire', unit: '' },
        { value: '6', label: 'Kat', unit: '' }
      ]
    },
    {
      id: 3,
      title: 'Bağcılar Meydan Life',
      location: 'Bağcılar, İstanbul',
      year: '2023',
      category: 'Tamamlanan',
      status: 'completed',
      description: 'İstanbul Bağcılar Meydan\'da konumlanmış modern yaşam projemiz. 12 katlı yapımızda 28 adet 3+1 daire, 2 ticari dükkan ve 3 katlı kapalı otopark bulunmaktadır.',
      image: '/assets/bagcilar_meydan_life/a7-min.png',
      stats: [
        { value: '12500', label: 'İnşaat Alanı', unit: 'm²' },
        { value: '28', label: 'Daire', unit: '' },
        { value: '12', label: 'Kat', unit: '' }
      ]
    },
    {
      id: 4,
      title: 'Fatih Gülbahçe Konağı',
      location: 'Fatih, İstanbul',
      year: '2022',
      category: 'Tarihi Restorasyon',
      status: 'completed',
      description: 'İstanbul Fatih Gülbahçe Sokağı\'nda bulunan tarihi konak restorasyonumuz. Bodrum katı betonarme, üzeri 3 kat tamamen ahşap yapım. Tavan desenleri dahil tüm detaylar tarihi aslına uygun olarak günümüz teknolojisiyle restore edilmiştir.',
      image: '/assets/fatih_gulbahce_konagi/12.jpg',
      stats: [
        { value: '1200', label: 'İnşaat Alanı', unit: 'm²' },
        { value: '1', label: 'Konak', unit: '' },
        { value: '4', label: 'Kat', unit: '' }
      ]
    }
  ];

  const getCategoryColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'ongoing': return '#f59e0b';
      case 'future': return '#8b5cf6';
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

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto-play için
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section className="section-padding section-white">
      <div className="container-custom">
        {/* Başlık */}
        <div className="section-header">
          <h2 className="heading-secondary">Konut Projelerimiz</h2>
          <p className="text-lead">
            Kaliteli işçilik ve modern tasarım anlayışımızla hayata geçirdiğimiz 
            konut projelerimize göz atın.
          </p>
        </div>

        {/* Desktop Projeler Grid */}
        <div className="projects-grid">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/proje/${project.title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')}`}
              className="project-card block"
            >
              <div className="project-image-container">
                {/* Proje Resmi */}
                <img
                  src={project.image}
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
                  {project.stats.map((stat, index) => (
                    <div key={index} className="stat">
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
                  to={`/proje/${project.title.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/ğ/g, 'g')
                    .replace(/ü/g, 'u')
                    .replace(/ş/g, 's')
                    .replace(/ı/g, 'i')
                    .replace(/ö/g, 'o')
                    .replace(/ç/g, 'c')}`}
                  className="project-card"
                >
                  <div className="project-image-container">
                    {/* Proje Resmi */}
                    <img
                      src={project.image}
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