import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiLocationMarker, HiPhone, HiMail, HiGlobeAlt } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const quickLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Hizmetler', path: '/#services', isServices: true },
    { name: 'Projeler', path: '/projeler' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  const services = [
    'Konut Projeleri',
    'Kentsel Dönüşüm',
    'Tadilat ve Renovasyon',
    'Mühendislik Danışmanlığı',
    'Proje Yönetimi',
    'Danışmanlık Hizmetleri',
  ];

  const handleServiceClick = (e) => {
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
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="footer">
      <div className="container-custom">
        <div className="footer-content">
          {/* Şirket Bilgileri */}
          <div className="footer-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <img src={logo} alt="Azaklar İnşaat" style={{ height: '40px', width: 'auto' }} />
            </div>
            <p style={{ color: '#9ca3af', lineHeight: '1.6', marginBottom: '24px' }}>
                              40 yıllık deneyimimizle, kaliteli ve güvenilir inşaat çözümleri sunuyoruz. 
              Her projede mükemmellik ve müşteri memnuniyeti önceliğimizdir.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'all 0.3s'
                  }}
                  aria-label={social.label}
                >
                  <social.icon style={{ width: '20px', height: '20px' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="footer-section">
            <h4>Hızlı Linkler</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.name} style={{ marginBottom: '12px' }}>
                  {link.isServices ? (
                    <button
                      onClick={handleServiceClick}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: '#9ca3af',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'color 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#f97316'}
                      onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link to={link.path} className="footer-section">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Hizmetler */}
          <div className="footer-section">
            <h4>Hizmetlerimiz</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {services.map((service) => (
                <li key={service} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={handleServiceClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#9ca3af',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color 0.3s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#f97316'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="footer-section">
            <h4>İletişim</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <HiLocationMarker style={{ width: '20px', height: '20px', color: '#f97316', marginTop: '4px' }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0 }}>
                    Şevketdağ Cd. No:18/A<br />
                    Güngören / Haznedar / İSTANBUL
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HiPhone style={{ width: '20px', height: '20px', color: '#f97316' }} />
                <p style={{ color: '#9ca3af', margin: 0 }}>(212) 555 03-96</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HiMail style={{ width: '20px', height: '20px', color: '#f97316' }} />
                <p style={{ color: '#9ca3af', margin: 0 }}>info@azaklaryapi.com</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HiGlobeAlt style={{ width: '20px', height: '20px', color: '#f97316' }} />
                <p style={{ color: '#9ca3af', margin: 0 }}>www.azaklaryapi.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alt Footer */}
        <div className="footer-bottom">
          <p>© {currentYear} AZAKLAR YAPI SANAYİ TİC. LTD. ŞTİ. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 