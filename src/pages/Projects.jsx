import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiCalendar, HiChevronRight } from 'react-icons/hi';
import { API_ENDPOINTS, apiCall } from '../config/api';

const baseUrl = import.meta.env.PROD ? "https://api.azaklaryapi.com" : "http://localhost:5177";

// Resim yükleme komponenti
const ImageLoader = ({ src, alt, fallbackSrc, className }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  useEffect(() => {
    setCurrentSrc(src);
    setImageLoading(true);
    setImageError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {!imageError && (
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Resim bulunamadı</div>
        </div>
      )}
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('Tümü');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await apiCall(`${API_ENDPOINTS.PROJECTS}`);
        
        // apiCall fonksiyonu response'u wrap ediyor, bu yüzden result.data.data şeklinde erişmemiz gerekiyor
        const projectsData = result.data?.data || result.data;
        
        if (result.success && projectsData && Array.isArray(projectsData)) {
          // Year alanına göre tersten sırala (yeni > eski)
          const sortedProjects = projectsData.sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA;
          });
          setProjects(sortedProjects);
          setFilteredProjects(sortedProjects);
        }
      } catch (error) {
        console.error('Projects Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Durum seçenekleri
  const statusOptions = [
    { value: 'Tümü', label: 'Tüm Projeler' },
    { value: 1, label: 'Devam Eden Projeler' },
    { value: 2, label: 'Tamamlanan Projeler' },
    { value: 3, label: 'Gelecek Projeler' }
  ];

  const filterProjects = () => {
    let filtered = projects;

    if (selectedStatus !== 'Tümü') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [selectedStatus, projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 container-custom section-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200 mb-4">
              Projelerimiz
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              40 yıllık deneyimimizle hayata geçirdiğimiz başarılı projelerimizi keşfedin
            </p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Proje Kategorileri</h3>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStatus('Tümü')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 'Tümü'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-orange-300'
                }`}
              >
                Tüm Projeler
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedStatus === 'Tümü' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {projects.length}
                </span>
              </button>
              
              <button
                onClick={() => setSelectedStatus(1)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 1
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                }`}
              >
                Devam Eden
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedStatus === 1 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {projects.filter(p => p.status === 1).length}
                </span>
              </button>
              
              <button
                onClick={() => setSelectedStatus(2)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 2
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-green-300'
                }`}
              >
                Tamamlanan
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedStatus === 2 
                    ? 'bg-white/20 text-white' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {projects.filter(p => p.status === 2).length}
                </span>
              </button>
              
              <button
                onClick={() => setSelectedStatus(3)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 3
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-purple-300'
                }`}
              >
                Gelecek
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedStatus === 3 
                    ? 'bg-white/20 text-white' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {projects.filter(p => p.status === 3).length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <Link to={`/proje/${project.slug}`}>
                {/* Proje Resmi */}
                <div className="project-image-container">
                  <ImageLoader
                    src={`${baseUrl}${project.images && project.images.length > 0 ? project.images[0] : ''}`}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-overlay" />
                  
                  {/* Kategori Badge */}
                  <div className="project-category">
                    {project.category}
                  </div>

                  {/* Lokasyon ve Tarih Bilgileri */}
                  <div className="project-info-overlay">
                    <div className="project-location">
                      <HiLocationMarker />
                      <span>{project.location}</span>
                    </div>
                    <div className="project-location">
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
                  {project.stats && project.stats.length > 0 && (
                    <div className="project-stats">
                      {project.stats.slice(0, 3).map((stat, statIndex) => (
                        <div key={statIndex} className="stat">
                          <div className="stat-value">
                            {stat.value}{stat.unit}
                          </div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detay Linki */}
                  <div className="project-link">
                    Detayları Gör
                    <HiChevronRight />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Seçilen kriterlere uygun proje bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects; 