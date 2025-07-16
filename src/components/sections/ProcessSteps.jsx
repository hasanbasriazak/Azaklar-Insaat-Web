import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiShieldCheck, HiDocumentText, HiTrash, HiCog, HiHome, HiClipboardList, HiKey, HiSupport, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const ProcessSteps = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  const steps = [
    {
      id: 1,
      icon: HiSearch,
      title: 'Ön Görüşme ve Fizibilite',
      description: 'Parsel ve imar durumu analiz edilir. Hak sahipleriyle ilk toplantı yapılır.',
      details: [
        'Parsel ve imar durumu analizi',
        'Hak sahipleriyle ilk toplantı',
        'Mevcut yapı incelemesi',
        'İmar çapı ve plan notları'
      ],
      duration: '1-2 Hafta',
      color: '#3b82f6'
    },
    {
      id: 2,
      icon: HiShieldCheck,
      title: 'Riskli Yapı Tespiti',
      description: 'Lisanslı kurumdan bina analizi talep edilir. Beton dayanımı ve taşıyıcı sistem testleri yapılır.',
      details: [
        'Lisanslı kurumdan bina analizi',
        'Beton dayanımı testleri',
        'Rapor İl Müdürlüğüne sunumu',
        '15 günlük itiraz süreci'
      ],
      duration: '3-4 Hafta',
      color: '#10b981'
    },
    {
      id: 3,
      icon: HiDocumentText,
      title: 'Kat Karşılığı Sözleşme',
      description: 'Tüm hak sahipleriyle noter onaylı sözleşme yapılır. Bağımsız bölümler açıkça belirtilir.',
      details: [
        'Noter onaylı sözleşme',
        'Bağımsız bölüm tahsisi',
        'Teslim süresi belirlenmesi',
        'Tapuya şerh işlemi'
      ],
      duration: '2-3 Hafta',
      color: '#f97316'
    },
    {
      id: 4,
      icon: HiTrash,
      title: 'Yıkım Süreci',
      description: 'Belediyeden yıkım ruhsatı alınır. Güvenlik önlemleri eşliğinde yıkım yapılır.',
      details: [
        'Yıkım ruhsatı alımı',
        'Altyapı hatlarının kapatılması',
        'Asbest raporu ve söküm',
        'Güvenli yıkım ve enkaz kaldırma'
      ],
      duration: '2-4 Hafta',
      color: '#8b5cf6'
    },
    {
      id: 5,
      icon: HiCog,
      title: 'Proje Hazırlığı ve Ruhsat',
      description: 'Zemin etüdü yapılır. Mimari, statik, elektrik, mekanik projeler hazırlanır.',
      details: [
        'Zemin etüdü ve onayı',
        'Tüm teknik projeler',
        'Yapı ruhsatı alımı',
        'Yapı denetim firması atanması'
      ],
      duration: '6-8 Hafta',
      color: '#06b6d4'
    },
    {
      id: 6,
      icon: HiClipboardList,
      title: 'Kat İrtifakı Kurulumu',
      description: 'Bağımsız bölüm listesi hazırlanır. Tüm maliklerin imzaları ile tapuda işlem yapılır.',
      details: [
        'Bağımsız bölüm listesi',
        'Arsa payı cetveli',
        'Tapuda işlem yapılması',
        'Devlet destekleri hazırlığı'
      ],
      duration: '3-4 Hafta',
      color: '#10b981'
    },
    {
      id: 7,
      icon: HiHome,
      title: 'İnşaat Süreci',
      description: 'Şantiye kurulumu yapılır. Kaba yapı ve ince yapı imalatları tamamlanır.',
      details: [
        'Şantiye kurulumu',
        'Kaba yapı imalatları',
        'İnce yapı çalışmaları',
        'Yapı denetim kontrolleri'
      ],
      duration: '12-18 Ay',
      color: '#ef4444'
    },
    {
      id: 8,
      icon: HiKey,
      title: 'İskan ve Teslim',
      description: 'Yapı kullanma izni alınır. Kat mülkiyetine geçiş yapılır.',
      details: [
        'Yapı kullanma izni',
        'Altyapı abonelik süreçleri',
        'Kat mülkiyetine geçiş',
        'Daire teslim tutanakları'
      ],
      duration: '4-6 Hafta',
      color: '#8b5cf6'
    },
    {
      id: 9,
      icon: HiSupport,
      title: 'Devlet Destekleri ve Son İşlemler',
      description: 'Kira yardımı başvuruları yapılır. Site yönetimi kurulumu ve resmi süreçler tamamlanır.',
      details: [
        'Kira yardımı başvuruları',
        'Kentsel dönüşüm kredisi',
        'Vergi muafiyetleri',
        'Site yönetimi kurulumu'
      ],
      duration: '6-8 Hafta',
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
    setCurrentSlide((prev) => (prev + 1) % steps.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + steps.length) % steps.length);
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
      setCurrentSlide((prev) => (prev + 1) % steps.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section className="section-padding section-gray">
      <div className="container-custom">
        {/* Başlık */}
        <div className="section-header">
          <h2 className="heading-secondary">Kentsel Dönüşüm Sürecimiz</h2>
          <p className="text-lead">
            Güncel mevzuatlara uygun olarak kentsel dönüşüm süreçlerini 
            adım adım ve şeffaf şekilde yönetiyoruz.
          </p>
        </div>

        {/* Desktop Süreç Adımları Grid */}
        <div className="process-steps-grid" style={{ position: 'relative', marginBottom: '80px' }}>
          {/* Süreç Çizgisi */}
          <div style={{
            display: 'none',
            position: 'absolute',
            top: '100px',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(to right, #3b82f6, #10b981, #f97316, #8b5cf6, #06b6d4, #10b981, #ef4444, #8b5cf6, #06b6d4)',
            opacity: '0.3',
            borderRadius: '2px'
          }} />
          
          {/* Adımlar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {steps.map((step) => (
              <div key={step.id} style={{ position: 'relative' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '40px 24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f3f4f6',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Adım Numarası */}
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    right: '-16px',
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #1f2937, #374151)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    {step.id}
                  </div>
                  
                  {/* İkon */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: step.color,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px'
                  }}>
                    <step.icon style={{ width: '40px', height: '40px', color: 'white' }} />
                  </div>
                  
                  {/* İçerik */}
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '16px'
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      marginBottom: '24px',
                      lineHeight: '1.6'
                    }}>
                      {step.description}
                    </p>
                    
                    {/* Detaylar */}
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      marginBottom: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {step.details.map((detail, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '14px',
                          color: '#6b7280',
                          textAlign: 'left'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#f97316',
                            borderRadius: '50%',
                            flexShrink: 0
                          }}></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Süre */}
                    <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                      <span style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                        color: '#4b5563',
                        padding: '8px 20px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Süreç Adımları Slider */}
        <div className="process-slider-container">
          <div 
            ref={sliderRef}
            className="process-slider"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${steps.length * 100}%`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {steps.map((step, index) => (
              <div key={step.id} className="process-slide">
                <div className="step-card">
                  {/* Adım Numarası */}
                  <div className="step-number">
                    {step.id}
                  </div>
                  
                  {/* İkon */}
                  <div className="step-icon" style={{ backgroundColor: step.color }}>
                    <step.icon />
                  </div>
                  
                  {/* İçerik */}
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                    
                    {/* Detaylar */}
                    <ul className="step-details">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="step-detail">
                          <div className="detail-dot"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Süre */}
                    <div className="step-duration">
                      <span>{step.duration}</span>
                    </div>
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
              {steps.map((_, index) => (
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
              disabled={currentSlide === steps.length - 1}
            >
              <HiChevronRight />
            </button>
          </div>
        </div>

        {/* CTA Bölümü */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
            color: 'white',
            borderRadius: '24px',
            padding: '60px 40px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              Kentsel Dönüşüm Sürecinizi Başlatın
            </h3>
            <p style={{
              fontSize: '1.1rem',
              opacity: '0.95',
              marginBottom: '40px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.7'
            }}>
              Uzman ekibimizle ücretsiz danışmanlık alın ve kentsel dönüşüm sürecinizi 
              güvenle başlatın. Her aşamada yanınızdayız.
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link to="/kentsel-donusum-danismanligi" style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '18px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.3)'
              }}>
                Ücretsiz Danışmanlık Al
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps; 