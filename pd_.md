import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiCalendar, HiChevronRight } from 'react-icons/hi';
import { API_ENDPOINTS, apiCall } from '../config/api';

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proje Durumu</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value === 'Tümü' ? 'Tümü' : parseInt(e.target.value))}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[length:12px_8px] bg-[position:calc(100%_-_16px)_center] cursor-pointer"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <Link to={`/proje/${project.slug}`}>
                {/* Proje Resmi */}
                <div className="project-image-container">
                  <img
                    src={project.images && project.images.length > 0 ? project.images[0] : '/src/assets/haznedar_park/26.jpg'}
                    alt={project.title}
                    className="project-image"
                    onError={(e) => {
                      e.target.src = '/src/assets/haznedar_park/26.jpg';
                    }}
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