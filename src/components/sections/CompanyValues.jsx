import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiShieldCheck, HiHeart, HiLightningBolt, HiTrendingUp, HiUsers, HiGlobe, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const CompanyValues = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  const values = [
    {
      icon: HiShieldCheck,
      title: 'Güvenlik ve Kalite',
      description: 'Her projede en yüksek güvenlik standartları ve kalite kontrolü uygularız. Müşterilerimizin güvenliği bizim önceliğimizdir.',
      color: '#3b82f6'
    },
    {
      icon: HiHeart,
      title: 'Müşteri Memnuniyeti',
      description: 'Müşterilerimizin ihtiyaçlarını anlayarak, beklentilerini aşan çözümler sunarız. Memnuniyet bizim başarımızdır.',
      color: '#ef4444'
    },
    {
      icon: HiLightningBolt,
      title: 'Yenilik ve Teknoloji',
      description: 'Sektördeki en son teknolojileri takip ederek, projelerimizde modern çözümler ve yenilikçi yaklaşımlar kullanırız.',
      color: '#f59e0b'
    },
    {
      icon: HiTrendingUp,
      title: 'Sürekli Gelişim',
      description: 'Kendimizi sürekli geliştirerek, sektörde öncü olmaya devam ediyoruz. Her gün daha iyisini hedefliyoruz.',
      color: '#10b981'
    },
    {
      icon: HiUsers,
      title: 'Takım Çalışması',
      description: 'Uzman ekibimizin uyumlu çalışması ile başarılı projeler hayata geçiriyoruz. Birlikte daha güçlüyüz.',
      color: '#8b5cf6'
    },
    {
      icon: HiGlobe,
      title: 'Sürdürülebilirlik',
      description: 'Çevre dostu malzemeler kullanarak, sürdürülebilir inşaat çözümleri sunuyoruz. Gelecek nesillere daha iyi bir dünya bırakıyoruz.',
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
    setCurrentSlide((prev) => (prev + 1) % values.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + values.length) % values.length);
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
      setCurrentSlide((prev) => (prev + 1) % values.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section className="section-padding section-gray">
      <div className="container-custom">
        {/* Başlık */}
        <div className="section-header">
          <h2 className="heading-secondary">Değerlerimiz</h2>
          <p className="text-lead">
            40 yıllık deneyimimizde edindiğimiz değerler, her projede rehberimiz oluyor. 
            Bu değerlerle inşaat sektöründe güvenilir bir marka olduk.
          </p>
        </div>

        {/* Desktop Değerler Grid */}
        <div className="services-grid">
          {values.map((value) => (
            <div key={value.title} className="service-card">
              {/* İkon */}
              <div className="service-icon" style={{ backgroundColor: value.color }}>
                <value.icon />
              </div>
              
              {/* İçerik */}
              <div className="service-content">
                <h3 className="service-title">{value.title}</h3>
                <p className="service-description">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Değerler Slider */}
        <div className="values-slider-container">
          <div 
            ref={sliderRef}
            className="values-slider"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${values.length * 100}%`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {values.map((value, index) => (
              <div key={value.title} className="values-slide">
                <div className="service-card">
                  {/* İkon */}
                  <div className="service-icon" style={{ backgroundColor: value.color }}>
                    <value.icon />
                  </div>
                  
                  {/* İçerik */}
                  <div className="service-content">
                    <h3 className="service-title">{value.title}</h3>
                    <p className="service-description">{value.description}</p>
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
              {values.map((_, index) => (
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
              disabled={currentSlide === values.length - 1}
            >
              <HiChevronRight />
            </button>
          </div>
        </div>

        {/* CTA Bölümü */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
              Hayalinizdeki Projeyi Birlikte Gerçekleştirelim
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '18px' }}>
              Değerlerimiz doğrultusunda, projenizi en iyi şekilde hayata geçirmek için 
              buradayız. Hemen iletişime geçin ve ücretsiz danışmanlık alın.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/iletisim" className="btn btn-primary btn-large">
                Hemen Başlayalım
              </Link>
              <Link to="/projeler" className="btn btn-outline btn-large">
                Projelerimizi İncele
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyValues; 