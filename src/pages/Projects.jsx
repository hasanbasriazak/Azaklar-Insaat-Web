import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiLocationMarker, HiCalendar, HiFilter } from 'react-icons/hi';

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const projects = [
    // Tamamlanan Projeler
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      title: 'Fatih Gülbahçe Konağı',
      location: 'Fatih, İstanbul',
      year: '2022',
      category: 'Tarihi Restorasyon',
      status: 'completed',
      description: 'İstanbul Fatih Gülbahçe Sokağı\'nda bulunan tarihi konak restorasyonumuz. Bodrum katı betonarme, üzeri 3 kat tamamen ahşap yapım.',
      image: '/assets/fatih_gulbahce_konagi/12.jpg',
      stats: [
        { value: '1200', label: 'İnşaat Alanı', unit: 'm²' },
        { value: '1', label: 'Konak', unit: '' },
        { value: '4', label: 'Kat', unit: '' }
      ]
    },
    {
      id: 4,
      title: 'Bahçelievler',
      location: 'Bahçelievler, İstanbul',
      year: '2024',
      category: 'Tamamlanan',
      status: 'completed',
      description: 'Bahçelievler bölgesindeki modern konut projemiz. Yüksek kalite standartları ile teslim edilmiştir.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80',
      stats: [
        { value: '8000', label: 'İnşaat Alanı', unit: 'm²' },
        { value: '20', label: 'Daire', unit: '' },
        { value: '8', label: 'Kat', unit: '' }
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'Tüm Projeler', count: projects.length },
    { id: 'completed', label: 'Tamamlanan', count: projects.filter(p => p.status === 'completed').length }
  ];

  const filteredProjects = selectedFilter === 'all' 
    ? projects 
    : projects.filter(project => project.status === selectedFilter);

  const getCategoryColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'ongoing': return 'bg-amber-500';
      case 'future': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'ongoing': return '⚡';
      case 'future': return '🚀';
      default: return '•';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Projelerimiz
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                Geçmişten geleceğe uzanan kaliteli inşaat projelerimizi keşfedin
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Filtre Section */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            {/* Filtre Başlığı */}
            <div className="flex items-center gap-3">
              <HiFilter className="text-2xl" style={{ color: '#1e3a8a' }} />
              <h2 className="text-2xl font-semibold text-gray-900">
                Proje Kategorileri
              </h2>
            </div>

            {/* Filtre Butonları */}
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedFilter === filter.id
                      ? 'text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedFilter === filter.id ? { backgroundColor: '#1e3a8a' } : {}}
                >
                  {filter.label}
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    selectedFilter === filter.id
                      ? 'bg-white/20 text-white'
                      : 'text-white'
                  }`}
                  style={selectedFilter === filter.id ? {} : { backgroundColor: '#1e40af' }}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projeler Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="project-card"
                >
                  <Link 
                    to={`/proje/${project.title.toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/ğ/g, 'g')
                      .replace(/ü/g, 'u')
                      .replace(/ş/g, 's')
                      .replace(/ı/g, 'i')
                      .replace(/ö/g, 'o')
                      .replace(/ç/g, 'c')}`}
                    className="block"
                  >
                    {/* Proje Resmi */}
                    <div className="project-image-container">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="project-image"
                      />
                      <div className="project-overlay" />
                      
                      {/* Status Badge */}
                      <div className={`project-category flex items-center gap-2 ${getCategoryColor(project.status)}`}>
                        <span>{getStatusIcon(project.status)}</span>
                        {project.category}
                      </div>

                      {/* Lokasyon ve Tarih */}
                      <div className="project-info-overlay">
                        <div className="flex items-center gap-2 text-sm">
                          <HiLocationMarker className="text-orange-400" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <HiCalendar className="text-orange-400" />
                          <span>{project.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proje Bilgileri */}
                    <div className="project-details">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>

                      {/* İstatistikler */}
                      <div className="project-stats">
                        {project.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="stat">
                            <div className="stat-value" style={{ color: '#1e3a8a' }}>
                              {stat.value}{stat.unit}
                            </div>
                            <div className="stat-label">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Detay Butonu */}
                      <div className="project-link" style={{ color: '#1e3a8a' }}>
                        Detayları Gör
                        <HiArrowRight />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Sonuç Bulunamadı */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Bu kategoride proje bulunamadı
              </h3>
              <p className="text-gray-600">
                Lütfen farklı bir kategori seçerek tekrar deneyin.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative section-padding bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 overflow-hidden"
        style={{
          boxShadow: 'inset 0 10px 20px -10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Top Gradient Overlay for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-100/80 to-transparent"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/60"></div>
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-600 bg-clip-text text-transparent">
                Hayalinizdeki Projeyi Birlikte Gerçekleştirelim
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Uzman ekibimiz ve kaliteli hizmet anlayışımızla sizin de hayalinizdeki projeyi gerçekleştirmek için buradayız.
              </p>
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ 
                  background: 'linear-gradient(to right, #1e3a8a, #1e40af)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #1e40af, #1d4ed8)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #1e3a8a, #1e40af)'}
              >
                Proje Teklifi Alın
                <HiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Projects; 