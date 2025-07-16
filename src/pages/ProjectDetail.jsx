import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  HiArrowLeft, 
  HiLocationMarker, 
  HiCalendar, 
  HiX, 
  HiChevronLeft, 
  HiChevronRight,
  HiHome,
  HiCube,
  HiOfficeBuilding
} from 'react-icons/hi';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Proje verileri
  const projects = {
    'haznedar-park': {
      id: 2,
      title: 'Haznedar Park',
      location: 'Güngören, İstanbul',
      year: '2023',
      category: 'Tamamlanan',
      status: 'completed',
      description: 'Güngören\'in en merkezi konumunda park ve İSPARK kapalı otoparka cepheli modern konut projesi. 2 blok halinde tasarlanan yapımızda toplamda 16 daire bulunmaktadır.',
      fullDescription: 'Haznedar Park projesi, Güngören\'in en merkezi konumunda konumlanmış modern bir yaşam alanıdır. Park manzaralı ve İSPARK kapalı otoparka cepheli bu özel projemiz, 2 blok halinde tasarlanmış olup toplamda 16 daire barındırmaktadır. Projemizde modern mimari anlayışı ile konfor bir araya getirilmiştir.',
      features: [
        'Park manzaralı konumlanma',
        'İSPARK kapalı otopark erişimi',
        '2 blok modern tasarım',
        'Merkezi konum avantajı',
        'Modern altyapı sistemleri'
      ],
      stats: [
        { icon: HiOfficeBuilding, value: '6500', label: 'İnşaat Alanı', unit: 'm²' },
        { icon: HiHome, value: '16', label: 'Daire', unit: '' },
        { icon: HiCube, value: '6', label: 'Kat', unit: '' }
      ],
      images: [
        '/assets/haznedar_park/26.jpg',
        '/assets/haznedar_park/2.jpg',
        '/assets/haznedar_park/3.jpg',
        '/assets/haznedar_park/4.jpg',
        '/assets/haznedar_park/6.jpg',
        '/assets/haznedar_park/9.jpg',
        '/assets/haznedar_park/10.jpg',
        '/assets/haznedar_park/11.jpg',
        '/assets/haznedar_park/12.jpg',
        '/assets/haznedar_park/13.jpg',
        '/assets/haznedar_park/14.jpg',
        '/assets/haznedar_park/15.jpg',
        '/assets/haznedar_park/19.jpg',
        '/assets/haznedar_park/20.jpg',
        '/assets/haznedar_park/23.jpg',
        '/assets/haznedar_park/24.jpg',
        '/assets/haznedar_park/25.jpg',
        '/assets/haznedar_park/27.jpg',
        '/assets/haznedar_park/29.jpg',
        '/assets/haznedar_park/30.jpg',
        '/assets/haznedar_park/31.jpg',
        '/assets/haznedar_park/32.jpg',
        '/assets/haznedar_park/33.jpg'
      ]
    },
    'bagcilar-meydan-life': {
      id: 3,
      title: 'Bağcılar Meydan Life',
      location: 'Bağcılar, İstanbul',
      year: '2023',
      category: 'Tamamlanan',
      status: 'completed',
      description: 'İstanbul Bağcılar Meydan\'da konumlanmış modern yaşam projemiz. 12 katlı yapımızda 28 adet 3+1 daire, 2 ticari dükkan ve 3 katlı kapalı otopark bulunmaktadır.',
      fullDescription: 'Bağcılar Meydan Life projesi, İstanbul\'un gelişen bölgelerinden Bağcılar Meydan\'da hayata geçirilen kapsamlı bir yaşam projesidir. 12 katlı modern yapımızda 28 adet 3+1 daire, 2 ticari dükkan ve 3 katlı kapalı otopark ile tam donanımlı bir yaşam alanı sunmaktadır.',
      features: [
        '28 adet 3+1 daire',
        '2 ticari dükkan alanı',
        '3 katlı kapalı otopark',
        '12 katlı modern yapı',
        'Merkezi konum avantajı'
      ],
      stats: [
        { icon: HiOfficeBuilding, value: '12500', label: 'İnşaat Alanı', unit: 'm²' },
        { icon: HiHome, value: '28', label: 'Daire', unit: '' },
        { icon: HiCube, value: '12', label: 'Kat', unit: '' }
      ],
      images: [
        '/assets/bagcilar_meydan_life/a7-min.png',
        '/assets/bagcilar_meydan_life/a1-min.png',
        '/assets/bagcilar_meydan_life/a2-min.png',
        '/assets/bagcilar_meydan_life/a3-min.png',
        '/assets/bagcilar_meydan_life/a4-min.png',
        '/assets/bagcilar_meydan_life/a5-min.png',
        '/assets/bagcilar_meydan_life/a6-min.png',
        '/assets/bagcilar_meydan_life/a8-min.png',
        '/assets/bagcilar_meydan_life/a9-min.png',
        '/assets/bagcilar_meydan_life/a10-min.png',
        '/assets/bagcilar_meydan_life/a11-min.png',
        '/assets/bagcilar_meydan_life/a12-min.png',
        '/assets/bagcilar_meydan_life/a13-min.png',
        '/assets/bagcilar_meydan_life/a14-min.png',
        '/assets/bagcilar_meydan_life/a16-min.png',
        '/assets/bagcilar_meydan_life/a17-min.png',
        '/assets/bagcilar_meydan_life/a18-min.png',
        '/assets/bagcilar_meydan_life/a19-min.png',
        '/assets/bagcilar_meydan_life/a20-min.png',
        '/assets/bagcilar_meydan_life/b1-min.png',
        '/assets/bagcilar_meydan_life/b2-min.png'
      ]
    },
    'fatih-gulbahce-konagi': {
      id: 4,
      title: 'Fatih Gülbahçe Konağı',
      location: 'Fatih, İstanbul',
      year: '2022',
      category: 'Tarihi Restorasyon',
      status: 'completed',
      description: 'İstanbul Fatih Gülbahçe Sokağı\'nda bulunan tarihi konak restorasyonumuz. Bodrum katı betonarme, üzeri 3 kat tamamen ahşap yapım. Tavan desenleri dahil tüm detaylar tarihi aslına uygun olarak günümüz teknolojisiyle restore edilmiştir.',
      fullDescription: 'Fatih Gülbahçe Konağı, İstanbul\'un tarihi dokusuna sahip çıkma projelerimizin en özel örneklerinden biridir. Gülbahçe Sokağı\'nda bulunan bu özel yapı, Azaklar Yapı tarafından tarihi aslını bozmadan günümüz teknolojisi ile birleştirilerek restore edilmiştir. Bodrum katı betonarme, üzeri 3 kat tamamen ahşap olan yapımızda tavan desenleri dahil tüm detaylar vidalı sistemle özgün haline kavuşturulmuştur.',
      features: [
        'Tarihi konak restorasyonu',
        'Ahşap el işçiliği detayları',
        'Özgün tavan desenleri',
        'Modern teknoloji entegrasyonu',
        'Vidalı sistem uygulaması'
      ],
      stats: [
        { icon: HiOfficeBuilding, value: '1200', label: 'İnşaat Alanı', unit: 'm²' },
        { icon: HiHome, value: '1', label: 'Konak', unit: '' },
        { icon: HiCube, value: '4', label: 'Kat', unit: '' }
      ],
      images: [
        '/assets/fatih_gulbahce_konagi/12.jpg',
        '/assets/fatih_gulbahce_konagi/1.jpg',
        '/assets/fatih_gulbahce_konagi/2.jpg',
        '/assets/fatih_gulbahce_konagi/3.jpg',
        '/assets/fatih_gulbahce_konagi/4.jpg',
        '/assets/fatih_gulbahce_konagi/5.jpg',
        '/assets/fatih_gulbahce_konagi/6.jpg',
        '/assets/fatih_gulbahce_konagi/7.jpg',
        '/assets/fatih_gulbahce_konagi/8.jpg',
        '/assets/fatih_gulbahce_konagi/9.jpg',
        '/assets/fatih_gulbahce_konagi/10.jpg',
        '/assets/fatih_gulbahce_konagi/11.jpg',
        '/assets/fatih_gulbahce_konagi/13.jpg',
        '/assets/fatih_gulbahce_konagi/14.jpg',
        '/assets/fatih_gulbahce_konagi/15.jpg',
        '/assets/fatih_gulbahce_konagi/16.jpg',
        '/assets/fatih_gulbahce_konagi/17.jpg',
        '/assets/fatih_gulbahce_konagi/18.jpg',
        '/assets/fatih_gulbahce_konagi/19.jpg',
        '/assets/fatih_gulbahce_konagi/20.jpg',
        '/assets/fatih_gulbahce_konagi/21.jpg',
        '/assets/fatih_gulbahce_konagi/22.jpg',
        '/assets/fatih_gulbahce_konagi/23.jpg',
        '/assets/fatih_gulbahce_konagi/24.jpg',
        '/assets/fatih_gulbahce_konagi/25.jpg',
        '/assets/fatih_gulbahce_konagi/26.jpg',
        '/assets/fatih_gulbahce_konagi/27.jpg',
        '/assets/fatih_gulbahce_konagi/28.jpg',
        '/assets/fatih_gulbahce_konagi/29.jpg',
        '/assets/fatih_gulbahce_konagi/30.jpg'
      ]
    }
  };

  const project = projects[projectId];

  useEffect(() => {
    if (!project) {
      navigate('/projeler');
    }
  }, [project, navigate]);

  const openLightbox = (imageIndex) => {
    setCurrentImageIndex(imageIndex);
    setSelectedImage(project.images[imageIndex]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % project.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(project.images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? project.images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(project.images[prevIndex]);
  };

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <motion.div
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
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => navigate('/projeler')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  <span>Projelere Geri Dön</span>
                </button>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <span className="px-4 py-1 bg-orange-500/20 text-orange-200 rounded-full text-sm font-medium border border-orange-400/30">
                  {project.category}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                {project.title}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <HiLocationMarker className="w-5 h-5 text-orange-400" />
                  <span className="text-lg">{project.location}</span>
                </div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <HiCalendar className="w-5 h-5 text-orange-400" />
                  <span className="text-lg">{project.year}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>


      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white relative z-20"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol Kolon - Proje Bilgileri */}
            <div className="lg:col-span-2 py-8">
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{project.fullDescription}</p>

              {/* Özellikler */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Proje Özellikleri</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sağ Kolon - İstatistikler */}
            <div className="lg:col-span-1 py-8">
              <div className="bg-white px-6 py-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Proje Detayları</h3>
                <div className="space-y-6">
                  {project.stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}{stat.unit}
                        </div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Galeri */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gray-50 py-20"
      >
        <div className="container-custom">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Proje Galerisi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image}
                alt={`${project.title} - ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all z-60"
            >
              <HiX className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all z-60"
            >
              <HiChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all z-60"
            >
              <HiChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={selectedImage}
              alt={project.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {project.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail; 