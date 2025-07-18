import { useState } from 'react';
import { HiOutlineDocumentAdd, HiOutlinePhotograph, HiOutlineClipboardList, HiOutlineInformationCircle, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineTag, HiOutlineCheckCircle, HiX, HiPlus, HiTrash } from 'react-icons/hi';
import { API_ENDPOINTS, apiCall, getApiConfig } from './config/api';

const initialStat = { value: '', label: '', unit: '' };

// Enum değerleri ve Türkçe karşılıkları
const STATUS_OPTIONS = [
  { value: 1, label: 'Devam Eden Proje' },
  { value: 2, label: 'Tamamlanan Proje' },
  { value: 3, label: 'Gelecek Proje' }
];

export default function ProjectAdd({ onSuccess, onCancel, editData }) {
  const [form, setForm] = useState(editData ? {
    ...editData,
    status: editData.status || 1, // Varsayılan: Devam Eden
    features: editData.features?.map(f => f.feature) || [''],
    stats: editData.stats?.length ? editData.stats : [{ ...initialStat }],
    images: editData.images || []
  } : {
    title: '', slug: '', description: '', fullDescription: '', location: '', year: '', category: '', status: 1, features: [''], stats: [ { ...initialStat } ], images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Slug otomatik üret
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(f => ({ ...f, title, slug: slugify(title) }));
  };
  const slugify = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Özellikler
  const handleFeatureChange = (i, val) => {
    const features = [...form.features];
    features[i] = val;
    setForm(f => ({ ...f, features }));
  };
  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ''] }));
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  // İstatistikler
  const handleStatChange = (i, key, val) => {
    const stats = [...form.stats];
    stats[i][key] = val;
    setForm(f => ({ ...f, stats }));
  };
  const addStat = () => setForm(f => ({ ...f, stats: [...f.stats, { ...initialStat }] }));
  const removeStat = (i) => setForm(f => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }));

  // Resimler
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const removeExistingImage = async (imageId) => {
    try {
      const result = await apiCall(`/api/projects/images/${imageId}/delete`, { method: 'POST' });
      if (result.success) {
        setForm(f => ({
          ...f,
          images: f.images.filter(img => img.id !== imageId)
        }));
      } else {
        alert('Resim silinirken hata oluştu: ' + result.error);
      }
    } catch (err) {
      alert('Resim silinirken hata oluştu');
    }
  };

  const setFeaturedImage = async (imageId) => {
    try {
      const result = await apiCall(`/api/projects/images/${imageId}/set-featured`, { method: 'POST' });
      if (result.success) {
        setForm(f => ({
          ...f,
          images: f.images.map(img => ({
            ...img,
            isFeatured: img.id === imageId
          })).sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
          })
        }));
        alert('Vitrin fotoğrafı başarıyla ayarlandı!');
      } else {
        alert('Vitrin fotoğrafı ayarlanırken hata oluştu: ' + result.error);
      }
    } catch (err) {
      alert('Vitrin fotoğrafı ayarlanırken hata oluştu');
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(false);
    try {
      // 1. Proje bilgisini kaydet
      const result = await apiCall(editData ? API_ENDPOINTS.PROJECTS_UPDATE : API_ENDPOINTS.PROJECTS, {
        method: editData ? 'POST' : 'POST',
        body: JSON.stringify({
          ...form,
          id: editData ? editData.id : undefined, // Update için ID gerekli
          status: Number(form.status), // API'ye int olarak gönder
          features: form.features.filter(f => f.trim()).map(f => ({ feature: f })),
          stats: form.stats.filter(s => s.value && s.label).map(s => ({ 
            value: s.value, 
            label: s.label, 
            unit: s.unit || '' 
          })),
          images: [] // ilk başta boş, sonra upload
        })
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Proje eklenemedi');
      }
      
      // 2. Resimleri yükle
      if (imageFiles.length > 0) {
        const fd = new FormData();
        fd.append('projectId', editData ? editData.id : result.data.id);
        imageFiles.forEach(f => fd.append('files', f));
        
        const imgRes = await fetch(API_ENDPOINTS.UPLOAD_IMAGES, {
          method: 'POST',
          body: fd
        });
        
        if (!imgRes.ok) {
          const imgData = await imgRes.json();
          throw new Error(imgData.message || 'Resimler yüklenemedi');
        }
      }
      
      setSuccess(true);
      if (onSuccess) onSuccess();
      setForm({
        title: '', slug: '', description: '', fullDescription: '', location: '', year: '', category: '', status: 1, features: [''], stats: [ { ...initialStat } ], images: []
      });
      setImageFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-0 m-0">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HiOutlineDocumentAdd className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {editData ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Temel Bilgiler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proje Adı *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="Proje adını girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="proje-adi"
                />
                <p className="text-xs text-gray-500 mt-1">Sadece küçük harf, rakam ve tire kullanın</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="İstanbul, Türkiye"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="Konut, Ticari, vb."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Açıklamalar */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Açıklamalar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kısa Açıklama *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Projenin kısa açıklaması"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detaylı Açıklama *
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.fullDescription}
                  onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))}
                  placeholder="Projenin detaylı açıklaması"
                />
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Proje Özellikleri</h3>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
              >
                <HiPlus className="w-4 h-4 mr-1" />
                Özellik Ekle
              </button>
            </div>
            
            <div className="space-y-3">
              {form.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={feature}
                    onChange={e => handleFeatureChange(index, e.target.value)}
                    placeholder="Proje özelliği"
                  />
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* İstatistikler */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Proje İstatistikleri</h3>
              <button
                type="button"
                onClick={addStat}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
              >
                <HiPlus className="w-4 h-4 mr-1" />
                İstatistik Ekle
              </button>
            </div>
            
            <div className="space-y-3">
              {form.stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Değer"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={stat.value}
                    onChange={e => handleStatChange(index, 'value', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Etiket"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={stat.label}
                    onChange={e => handleStatChange(index, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Birim"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={stat.unit}
                    onChange={e => handleStatChange(index, 'unit', e.target.value)}
                  />
                  {form.stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resimler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Proje Resimleri</h3>
            
            {/* Mevcut Resimler */}
            {form.images && form.images.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Mevcut Resimler ({form.images.length} adet)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {form.images.map((image, index) => {
                    const { baseUrl } = getApiConfig();
                    const imageUrl = `${baseUrl}${image.imageUrl}`;
                    const isFeatured = image.isFeatured;
                    console.log('Resim URL:', imageUrl);
                    return (
                      <div key={image.id || index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Proje resmi ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-lg border-2 ${
                            isFeatured ? 'border-blue-500' : 'border-gray-200'
                          }`}
                          onError={(e) => {
                            console.error('Resim yüklenemedi:', imageUrl);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Resim başarıyla yüklendi:', imageUrl);
                          }}
                        />
                        
                        {/* Vitrin Badge */}
                        {isFeatured && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Vitrin
                          </div>
                        )}
                        
                        {/* Butonlar */}
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Vitrin Yap Butonu */}
                          {!isFeatured && (
                            <button
                              type="button"
                              onClick={() => setFeaturedImage(image.id)}
                              className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600"
                              title="Vitrin fotoğrafı yap"
                            >
                              ⭐
                            </button>
                          )}
                          
                          {/* Sil Butonu */}
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            title="Resmi sil"
                          >
                            <HiX className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Yeni Resim Ekleme */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <HiOutlinePhotograph className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Yeni Resim Ekle
              </label>
              {imageFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Seçilen dosyalar:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(imageFiles).map((file, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hata ve Başarı Mesajları */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">Proje başarıyla kaydedildi!</div>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kaydediliyor...' : (editData ? 'Güncelle' : 'Kaydet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 