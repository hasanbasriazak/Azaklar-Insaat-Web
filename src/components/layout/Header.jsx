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
    <header className="header">
      {/* Modern Architectural Pattern Overlay */}
      <div className="header-pattern-overlay" />

      {/* Üst İletişim Barı - Minimal ve Şık */}
      <div className="header-top">
        <div className="container-custom">
          <div className="header-top-content">
            <div className="header-contact-info">
              <div className="contact-item">
                <HiPhone className="contact-icon" />
                <span>(212) 555 03-96</span>
              </div>
              <div className="contact-item">
                <HiMail className="contact-icon" />
                <span>info@azaklaryapi.com</span>
              </div>
            </div>
            <div className="header-slogan">
              40+ Yıllık Deneyim • Güvenilir İnşaat Çözümleri
            </div>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon - Düzenlenmiş */}
      <nav className="header-nav">
        <div className="container-custom">
          <div className="nav-container">
            
            {/* Logo ve Slogan - Dikey Düzen */}
            <Link to="/" className="logo-section">
              <img 
                src={logo} 
                alt="Azaklar İnşaat" 
                className="logo"
              />
              <div className="logo-text">
                <p>Güvenilir İnşaat Çözümleri</p>
              </div>
            </Link>

            {/* Desktop Navigation - Modern Stil */}
            <div className="nav-menu desktop-nav">
              {navItems.map((item) => {
                if (item.name === 'Hizmetler') {
                  return (
                    <button
                      key={item.name}
                      onClick={handleServicesClick}
                      className={`nav-link ${isServicesActive() ? 'active' : ''}`}
                    >
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button - Modern */}
            <Link 
              to="/kentsel-donusum-danismanligi" 
              className="btn btn-secondary desktop-cta"
            >
              Ücretsiz Danışmanlık
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <HiX className="menu-icon" />
              ) : (
                <HiMenuAlt3 className="menu-icon" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <img 
                src={logo} 
                alt="Azaklar İnşaat" 
                className="mobile-logo"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mobile-close-button"
              >
                <HiX className="close-icon" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="mobile-nav-links">
              {navItems.map((item) => {
                if (item.name === 'Hizmetler') {
                  return (
                    <button
                      key={item.name}
                      onClick={handleServicesClick}
                      className={`mobile-nav-link ${isServicesActive() ? 'active' : ''}`}
                    >
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA Button */}
            <div className="mobile-cta-container">
              <Link 
                to="/kentsel-donusum-danismanligi" 
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-secondary mobile-cta"
              >
                Ücretsiz Danışmanlık
              </Link>
            </div>

            {/* Mobile Contact Info */}
            <div className="mobile-contact-info">
              <div className="mobile-contact-item">
                <HiPhone className="mobile-contact-icon" />
                <span>(212) 555 03-96</span>
              </div>
              <div className="mobile-contact-item">
                <HiMail className="mobile-contact-icon" />
                <span>info@azaklaryapi.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Bottom Border */}
      <div className="header-bottom-border" />
    </header>
  );
};

export default Header; 