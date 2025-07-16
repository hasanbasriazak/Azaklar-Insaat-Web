import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      {/* Mimari Arkaplan Overlay */}
      <div className="hero-architectural-overlay"></div>
      
      <div className="hero-content">
        <h1>
          Güçlü Temellerle<br />
          <span className="highlight">Güvenli Gelecek</span>
        </h1>
        <p>
                            40 yıllık deneyimimizle hayalinizdeki yapıları en kaliteli malzemeler 
          ve uzman ekibimizle inşa ediyoruz. Her projede mükemmellik, her detayda özen.
        </p>
        
        <div className="hero-buttons">
          <Link to="/projeler" className="btn btn-secondary btn-large">
            Projelerimizi İncele
          </Link>
          <Link to="/kentsel-donusum-danismanligi" className="btn btn-outline-white btn-large">
            Ücretsiz Danışmanlık
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero; 