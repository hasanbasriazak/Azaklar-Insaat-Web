import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5177/api/projects/${slug}`);
        if (response.ok) {
          const result = await response.json();
          // API response yapısı: { success: true, data: project }
          if (result.success && result.data) {
            setProject(result.data);
          } else {
            navigate('/projeler');
          }
        } else {
          navigate('/projeler');
        }
      } catch (error) {
        console.error('Proje yüklenirken hata:', error);
        navigate('/projeler');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      1: { text: 'Devam Ediyor', color: 'bg-blue-500' },
      2: { text: 'Tamamlandı', color: 'bg-green-500' },
      3: { text: 'Planlanan', color: 'bg-yellow-500' }
    };
    
    const config = statusConfig[status] || statusConfig[2];
    return (
      <span className={`px-3 py-1 ${config.color} text-white rounded-full text-sm font-medium`}>
        {config.text}
      </span>
    );
  };

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
                {getStatusBadge(project.status)}
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
              {project.features && project.features.length > 0 && (
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
              )}
            </div>

            {/* Sağ Kolon - İstatistikler */}
            <div className="lg:col-span-1 py-8">
              <div className="bg-white px-6 py-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Proje Detayları</h3>
                <div className="space-y-6">
                  {project.stats && project.stats.length > 0 && project.stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <HiOfficeBuilding className="w-6 h-6 text-orange-600" />
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
      {project.images && project.images.length > 0 && (
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
                    src={`http://localhost:5177${image}`}
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
      )}

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
              src={`http://localhost:5177${selectedImage}`}
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