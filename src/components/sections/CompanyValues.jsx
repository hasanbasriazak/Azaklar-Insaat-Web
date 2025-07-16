import { Link } from 'react-router-dom';
import { HiShieldCheck, HiHeart, HiLightningBolt, HiTrendingUp, HiUsers, HiGlobe } from 'react-icons/hi';

const CompanyValues = () => {
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

        {/* Değerler Grid */}
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