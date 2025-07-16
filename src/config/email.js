import { API_ENDPOINTS, apiCall } from './api.js';

// Normal iletişim formu için mail gönderme
export const sendContactEmail = async (formData, files = {}) => {
  try {
    // FormData oluştur
    const formDataToSend = new FormData();
    formDataToSend.append('formData', JSON.stringify(formData));

    // Dosyaları ekle
    Object.entries(files).forEach(([category, fileList]) => {
      if (fileList && fileList.length > 0) {
        fileList.forEach(file => {
          formDataToSend.append(category, file);
        });
      }
    });

    const response = await fetch(API_ENDPOINTS.KENTSEL_EMAIL, {
      method: 'POST',
      body: formDataToSend
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Mail gönderilemedi');
    }

    return result;
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    throw error;
  }
};

// Kentsel dönüşüm formu için mail gönderme
export const sendKentselEmail = async (formData, files = {}) => {
  try {
    // FormData oluştur
    const formDataToSend = new FormData();
    
    // Backend'in beklediği formata dönüştür
    const kentselData = {
      name: formData.step1?.adSoyad || '',
      email: formData.step1?.email || '',
      phone: formData.step1?.telefon || '',
      address: formData.step2?.acikAdres || '',
      district: formData.step2?.ilce || '',
      buildingAge: formData.step3?.binaYasi?.toString() || '',
      buildingType: formData.step3?.binaDurumu || '',
      floorCount: formData.step3?.katSayisi?.toString() || '',
      apartmentCount: formData.step3?.bagimsisBolum?.toString() || '',
      notes: JSON.stringify(formData) // Tüm form verilerini notes'a ekle
    };

    // Zorunlu alanları kontrol et
    if (!kentselData.name || !kentselData.email || !kentselData.phone) {
      throw new Error('Ad Soyad, E-posta ve Telefon alanları zorunludur');
    }

    // Backend'in beklediği alanları ekle
    Object.entries(kentselData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Dosyaları ekle
    Object.entries(files).forEach(([category, fileList]) => {
      if (fileList && fileList.length > 0) {
        fileList.forEach(file => {
          if (file && file.name) { // Sadece geçerli dosyaları ekle
            formDataToSend.append('files', file);
          }
        });
      }
    });

    const response = await fetch(API_ENDPOINTS.KENTSEL_EMAIL, {
      method: 'POST',
      body: formDataToSend
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Mail gönderilemedi');
    }

    return result;
  } catch (error) {
    console.error('Kentsel mail gönderme hatası:', error);
    throw error;
  }
};

// API sağlık kontrolü
export const checkMailServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Mail server bağlantı hatası:', error);
    return { status: 'ERROR', message: 'Mail server bağlantısı kurulamadı' };
  }
};

// Form verilerini özetleyen fonksiyon (display için)
export const formatFormDataForEmail = (formData) => {
  const getFieldLabel = (field) => {
    const labels = {
      adSoyad: 'Ad Soyad',
      telefon: 'Telefon',
      email: 'E-posta',
      iletisimTercihi: 'İletişim Tercihi',
      ilce: 'İlçe',
      mahalle: 'Mahalle',
      acikAdres: 'Açık Adres',
      tapuBilgisi: 'Tapu Bilgisi',
      binaYasi: 'Bina Yaşı',
      katSayisi: 'Kat Sayısı',
      bagimsisBolum: 'Bağımsız Bölüm Sayısı',
      binaDurumu: 'Bina Durumu',
      riskliYapi: 'Riskli Yapı Başvurusu',
      toplamMalik: 'Toplam Malik Sayısı',
      aktifMalik: 'Aktif İletişimdeki Malik Sayısı',
      malikBakis: 'Maliklerin Dönüşüme Bakışı',
      tapuTuru: 'Tapu Türü',
      donusumTuru: 'Dönüşüm Türü',
      baslamaSure: 'Başlama Süresi'
    };
    return labels[field] || field;
  };

  const steps = [
    { title: '👤 Kişisel Bilgiler', data: formData.step1 },
    { title: '📍 Gayrimenkulün Konumu', data: formData.step2 },
    { title: '🏗️ Mevcut Yapının Durumu', data: formData.step3 },
    { title: '👥 Malik Bilgileri', data: formData.step4 },
    { title: '🎯 Dönüşüm Talebi ve Hedefi', data: formData.step5 },
    { title: '📎 Belgeler ve Görseller', data: formData.step6 }
  ];

  let emailContent = `
    <h2>🏗️ Kentsel Dönüşüm Danışmanlık Başvurusu</h2>
    <p><strong>Başvuru Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}</p>
    <p><strong>Referans ID:</strong> ${formData.referenceId}</p>
    <hr>
  `;

  steps.forEach(step => {
    if (step.data && Object.keys(step.data).length > 0) {
      emailContent += `<h3>${step.title}</h3><ul>`;
      
      Object.entries(step.data).forEach(([key, value]) => {
        if (value && value !== '') {
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          emailContent += `<li><strong>${getFieldLabel(key)}:</strong> ${displayValue}</li>`;
        }
      });
      
      emailContent += '</ul><br>';
    }
  });

  return emailContent;
}; 