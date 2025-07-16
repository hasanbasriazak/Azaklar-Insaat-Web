import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX, HiPhone, HiMail } from 'react-icons/hi';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Hizmetler', path: '/hizmetler' },
    { name: 'Projeler', path: '/projeler' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      // Ana sayfa sadece hash yokken aktif olmalı
      return location.pathname === path && !location.hash;
    }
    return location.pathname === path;
  };
  
  const isServicesActive = () => {
    return location.pathname === '/' && location.hash === '#services';
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Ana sayfada isek direkt scroll yap
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Başka sayfada isek ana sayfaya git ve hash ile scroll yap
      navigate('/#services');
    }
    setIsMenuOpen(false);
  };

  return (
    <header style={{ 
      position: 'relative',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      zIndex: 50,
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
    }}>
      {/* Modern Architectural Pattern Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(45deg, transparent 48%, rgba(30, 58, 138, 0.02) 50%, transparent 52%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 60px,
            rgba(30, 58, 138, 0.01) 60px,
            rgba(30, 58, 138, 0.01) 120px
          )
        `,
        pointerEvents: 'none'
      }} />

      {/* Üst İletişim Barı - Minimal ve Şık */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: '#ffffff',
        padding: '10px 0',
        fontSize: '14px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: '0.95' }}>
                <HiPhone style={{ color: '#f97316', width: '16px', height: '16px' }} />
                <span style={{ fontWeight: '500' }}>(212) 555 03-96</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: '0.95' }}>
                <HiMail style={{ color: '#f97316', width: '16px', height: '16px' }} />
                <span style={{ fontWeight: '500' }}>info@azaklaryapi.com</span>
              </div>
            </div>
            <div style={{ 
              fontSize: '13px', 
              opacity: '0.9',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}>
              40+ Yıllık Deneyim • Güvenilir İnşaat Çözümleri
            </div>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon - Düzenlenmiş */}
      <nav style={{ padding: '20px 0', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Logo ve Slogan - Dikey Düzen */}
            <Link to="/" style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={logo} 
                alt="Azaklar İnşaat" 
                style={{ 
                  height: '48px',
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  marginBottom: '4px'
                }} 
              />
              <p style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                margin: 0,
                fontWeight: '500',
                letterSpacing: '0.3px'
              }}>
                Güvenilir İnşaat Çözümleri
              </p>
            </Link>

            {/* Desktop Navigation - Modern Stil */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {navItems.map((item) => {
                if (item.name === 'Hizmetler') {
                  return (
                    <button
                      key={item.name}
                      onClick={handleServicesClick}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isServicesActive() ? '#1e3a8a' : '#4b5563',
                        textDecoration: 'none',
                        fontWeight: isServicesActive() ? '600' : '500',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        padding: '12px 0',
                        letterSpacing: '0.3px',
                        borderBottom: isServicesActive() ? '2px solid #f97316' : '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#1e3a8a';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = isServicesActive() ? '#1e3a8a' : '#4b5563';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      color: isActive(item.path) ? '#1e3a8a' : '#4b5563',
                      textDecoration: 'none',
                      fontWeight: isActive(item.path) ? '600' : '500',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      padding: '12px 0',
                      letterSpacing: '0.3px',
                      borderBottom: isActive(item.path) ? '2px solid #f97316' : '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.target.style.color = '#1e3a8a';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.target.style.color = '#4b5563';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button - Modern */}
            <Link 
              to="/kentsel-donusum-danismanligi" 
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.3)',
                border: 'none',
                letterSpacing: '0.3px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 15px -3px rgba(249, 115, 22, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(249, 115, 22, 0.3)';
              }}
            >
              Ücretsiz Danışmanlık
            </Link>

            {/* Mobile Menu Button */}
            <button
              style={{ 
                display: 'none',
                padding: '12px',
                border: 'none',
                background: 'rgba(30, 58, 138, 0.1)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <HiX style={{ width: '24px', height: '24px', color: '#1e3a8a' }} />
              ) : (
                <HiMenuAlt3 style={{ width: '24px', height: '24px', color: '#1e3a8a' }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Decorative Bottom Border */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #f97316, transparent)',
        opacity: '0.6'
      }} />
    </header>
  );
};

export default Header; 