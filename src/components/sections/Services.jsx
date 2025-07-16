import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiRefresh, HiClipboardList, HiCog, HiOfficeBuilding, HiChat, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Services = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  const services = [
    {
      icon: HiHome,
      title: 'Konut Projeleri',
      description: 'Modern ve konforlu yaşam alanları tasarlıyor, yüksek kaliteli malzemelerle inşa ediyoruz.',
      features: ['Apartman Projeleri','Villa ve Müstakil Evler'],
      color: '#3b82f6'
    },
    {
      icon: HiOfficeBuilding,
      title: 'Kentsel Dönüşüm',
      description: 'Güncel mevzuatlara uygun kentsel dönüşüm süreçlerini profesyonelce yönetiyoruz.',
      features: ['Mevzuat Danışmanlığı', 'Proje Koordinasyonu', 'Yasal Süreç Yönetimi'],
      color: '#10b981'
    },
    {
      icon: HiRefresh,
      title: 'Tadilat ve Renovasyon',
      description: 'Mevcut yapıları modern standartlara uygun hale getiriyoruz.',
      features: ['Bina Yenileme', 'İç Mekan Tasarımı', 'Çevre Düzenlemesi'],
      color: '#f59e0b'
    },
    {
      icon: HiCog,
      title: 'Mühendislik Danışmanlığı',
      description: 'Uzman mühendislik ekibimizle teknik çözümler ve danışmanlık hizmetleri.',
      features: ['Statik Analiz', 'Zemin Etüdü', 'Teknik Çözümler'],
      color: '#ef4444'
    },
    {
      icon: HiClipboardList,
      title: 'Proje Yönetimi',
      description: 'Başlangıçtan bitişe kadar tüm süreçleri profesyonelce yönetiyoruz.',
      features: ['Planlama ve Koordinasyon', 'Kalite Kontrol', 'Zaman Yönetimi'],
      color: '#8b5cf6'
    },
    {
      icon: HiChat,
      title: 'Ücretsiz Danışmanlık',
      description: 'Projeleriniz için uzman görüşü ve teknik danışmanlık hizmetimizden ücretsiz yararlanın.',
      features: ['İlk Görüşme', 'Fizibilite Analizi', 'Çözüm Önerileri'],
      color: '#06b6d4'
    }
  ];

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
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
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
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section id="services" className="section-padding section-gray">
      <div className="container-custom">
        {/* Başlık */}
        <div className="section-header">
          <h2 className="heading-secondary">Hizmetlerimiz</h2>
          <p className="text-lead">
            Modern teknoloji ve uzman ekibimizle, inşaat sektöründe 
            kapsamlı çözümler sunuyoruz.
          </p>
        </div>

        {/* Desktop Hizmetler Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card">
              {/* İkon */}
              <div className="service-icon" style={{ backgroundColor: service.color }}>
                <service.icon />
              </div>
              
              {/* İçerik */}
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                {/* Özellikler */}
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="service-feature">
                      <div className="feature-dot"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Hizmetler Slider */}
        <div className="services-slider-container">
          <div 
            ref={sliderRef}
            className="services-slider"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${services.length * 100}%`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {services.map((service, index) => (
              <div key={service.title} className="services-slide">
                <div className="service-card">
                  {/* İkon */}
                  <div className="service-icon" style={{ backgroundColor: service.color }}>
                    <service.icon />
                  </div>
                  
                  {/* İçerik */}
                  <div className="service-content">
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    
                    {/* Özellikler */}
                    <ul className="service-features">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="service-feature">
                          <div className="feature-dot"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
              {services.map((_, index) => (
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
              disabled={currentSlide === services.length - 1}
            >
              <HiChevronRight />
            </button>
          </div>
        </div>

        {/* CTA Bölümü */}
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">
              Projeniz için özel çözümler mi arıyorsunuz?
            </h3>
            <p className="cta-description">
              Uzman ekibimizle görüşerek, ihtiyaçlarınıza özel çözümler geliştirebiliriz. 
            </p>
            <div className="cta-buttons" style={{ justifyContent: 'center' }}>
              <Link to="/kentsel-donusum-danismanligi" className="btn btn-secondary btn-large">
                Ücretsiz Danışmanlık Al
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 