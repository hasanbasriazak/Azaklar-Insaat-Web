import { Link } from 'react-router-dom';
import { HiArrowRight, HiLocationMarker, HiCalendar } from 'react-icons/hi';

const FeaturedProjects = () => {
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
      image: '/src/assets/haznedar_park/26.jpg',
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
      image: '/src/assets/bagcilar_meydan_life/a7-min.png',
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
      image: '/src/assets/fatih_gulbahce_konagi/12.jpg',
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

        {/* Projeler Grid */}
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

        {/* Tüm Projeler Butonu */}
        <div className="section-cta">
          <Link to="/projeler" className="btn btn-primary btn-large">
            Tüm Projelerimizi Görüntüle
            <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects; 