import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Uploads klasörünü oluştur
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Dosya adını güvenli hale getir
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const timestamp = Date.now();
    cb(null, `${timestamp}_${sanitizedName}`);
  }
});

// Güvenlik: Yasaklı dosya uzantıları
const dangerousExtensions = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.msi', '.dll', '.sh', '.php', '.asp', '.aspx', '.jsp'
];

// Güvenlik: Dosya adı temizleme
const sanitizeFileName = (filename) => {
  // Tehlikeli karakterleri kaldır
  let sanitized = filename.replace(/[<>:"/\\|?*]/g, '_');
  
  // Yasaklı uzantıları kontrol et
  const ext = path.extname(sanitized).toLowerCase();
  if (dangerousExtensions.includes(ext)) {
    sanitized = sanitized.replace(ext, '_' + ext);
  }
  
  // Windows yasaklı isimleri
  const windowsReserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = path.basename(sanitized, path.extname(sanitized));
  if (windowsReserved.includes(nameWithoutExt.toUpperCase())) {
    sanitized = '_' + sanitized;
  }
  
  return sanitized;
};

// Basit rate limiting
const uploadAttempts = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 dakika
const MAX_ATTEMPTS = 10; // 5 dakikada max 10 upload

const checkRateLimit = (ip) => {
  const now = Date.now();
  const attempts = uploadAttempts.get(ip) || { count: 0, firstAttempt: now };
  
  // Zaman aralığı sıfırla
  if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
    uploadAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  
  // Limit kontrolü
  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  // Counter'ı artır
  attempts.count++;
  uploadAttempts.set(ip, attempts);
  return true;
};

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  // MIME type kontrolü
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error(`Desteklenmeyen dosya türü: ${file.mimetype}`), false);
    return;
  }
  
  // Dosya adı güvenlik kontrolü
  const sanitizedOriginalName = sanitizeFileName(file.originalname);
  file.originalname = sanitizedOriginalName;
  
  // Dosya uzantısı MIME type ile uyumlu mu?
  const ext = path.extname(file.originalname).toLowerCase();
  const validExtensions = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  };
  
  if (!validExtensions[file.mimetype]?.includes(ext)) {
    cb(new Error(`Dosya uzantısı MIME type ile uyumlu değil: ${ext} (${file.mimetype})`), false);
    return;
  }
  
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 20 // Max 20 files
  }
});

// SMTP Konfigürasyonu (Güvenli - backend'de)
const transporter = nodemailer.createTransport({
  host: 'mail.kurumsaleposta.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'kentsel@azaklaryapi.com',
    pass: 'FZrCfQxz1298:=::'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Mail gönderme fonksiyonu
const sendContactEmail = async (formData, files = []) => {
  const results = [];

  // 1. Azaklar İnşaat'a detaylı mail (attachments ile)
  const companyEmailHTML = formatFormDataForEmail(formData, files);
  
  const companyAttachments = files.map(file => ({
    filename: file.originalname,
    path: file.path,
    contentType: file.mimetype
  }));

  const companyMailOptions = {
    from: '"Kentsel Dönüşüm Sistemi" <kentsel@azaklaryapi.com>',
    to: 'kentsel@azaklaryapi.com',
    subject: `Kentsel Dönüşüm Başvurusu - ${formData.referenceId}`,
    html: companyEmailHTML,
    replyTo: formData.step1?.email || 'kentsel@azaklaryapi.com',
    attachments: companyAttachments
  };

  const companyResult = await transporter.sendMail(companyMailOptions);
  results.push({ type: 'company', ...companyResult });

  // 2. Müşteriye özet mail (attachment'sız)
  if (formData.step1?.email) {
    const customerEmailHTML = formatCustomerConfirmationEmail(formData);
    
    const customerMailOptions = {
      from: '"Azaklar İnşaat" <kentsel@azaklaryapi.com>',
      to: formData.step1.email,
      subject: `Başvurunuz Alındı - ${formData.referenceId}`,
      html: customerEmailHTML,
      // Attachments yok
    };

    try {
      const customerResult = await transporter.sendMail(customerMailOptions);
      results.push({ type: 'customer', ...customerResult });
    } catch (error) {
      console.error('❌ Müşteri mailı gönderilemedi:', error);
      // Müşteri maili başarısız olsa da company mail başarılıysa devam et
    }
  }

  return results;
};

// Temp dosyaları temizle
const cleanupFiles = (files) => {
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log(`🗑️ Temp dosya silindi: ${file.filename}`);
      }
    } catch (error) {
      console.error(`❌ Dosya silme hatası: ${file.filename}`, error);
    }
  });
};

// Form verilerini HTML formatına çeviren fonksiyon
const formatFormDataForEmail = (formData, files = []) => {
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

  let emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1e3a8a, #f97316); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .info-box { background: #f8fafc; border-left: 4px solid #f97316; padding: 15px; margin: 15px 0; }
        .section { margin: 20px 0; }
        .section h3 { color: #1e3a8a; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
        .field { margin: 8px 0; padding: 8px; background: #fff; border-radius: 4px; border: 1px solid #e5e7eb; }
        .field strong { color: #1e3a8a; }
        .footer { margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏗️ Kentsel Dönüşüm Danışmanlık Başvurusu</h1>
        <p><strong>Başvuru Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        <p><strong>Referans ID:</strong> ${formData.referenceId}</p>
      </div>
      
      <div class="info-box">
        <strong>Hızlı Özet:</strong><br>
        <strong>Başvuran:</strong> ${formData.step1?.adSoyad || 'Belirtilmemiş'}<br>
        <strong>Telefon:</strong> ${formData.step1?.telefon || 'Belirtilmemiş'}<br>
        <strong>Konum:</strong> İstanbul/${formData.step2?.ilce || 'Belirtilmemiş'}<br>
        <strong>Bina Yaşı:</strong> ${formData.step3?.binaYasi || 'Belirtilmemiş'} yıl
      </div>
  `;

  steps.forEach(step => {
    if (step.data && Object.keys(step.data).length > 0) {
      emailHTML += `<div class="section"><h3>${step.title}</h3>`;
      
      Object.entries(step.data).forEach(([key, value]) => {
        if (value && value !== '') {
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          emailHTML += `<div class="field"><strong>${getFieldLabel(key)}:</strong> ${displayValue}</div>`;
        }
      });
      
      emailHTML += '</div>';
    }
  });

  // Dosyalar bölümü
  if (files && files.length > 0) {
    emailHTML += `<div class="section"><h3>📎 Eklenen Dosyalar (${files.length} adet)</h3>`;
    
    // Dosyaları kategorize et
    const fileCategories = {
      'Tapu Görseli': files.filter(f => f.fieldname === 'tapuGorseli'),
      'Bina Fotoğrafları': files.filter(f => f.fieldname === 'binaFotograflari'),
      'Diğer Belgeler': files.filter(f => f.fieldname === 'digerBelgeler')
    };

    Object.entries(fileCategories).forEach(([category, categoryFiles]) => {
      if (categoryFiles.length > 0) {
        emailHTML += `<h4 style="color: #f97316; margin: 15px 0 10px 0;">${category}</h4>`;
        categoryFiles.forEach(file => {
          const fileSize = (file.size / 1024 / 1024).toFixed(2);
          emailHTML += `<div class="field">
            <strong>📄 ${file.originalname}</strong> 
            (${fileSize} MB - ${file.mimetype})
          </div>`;
        });
      }
    });
    
    emailHTML += '</div>';
  }

  emailHTML += `
      <div class="footer">
        <p>Bu başvuru Azaklar İnşaat kurumsal web sitesi üzerinden otomatik olarak gönderilmiştir.</p>
        <p>Başvuru sahibiyle en kısa sürede iletişime geçilmesi önerilir.</p>
        ${files.length > 0 ? `<p><strong>📎 ${files.length} dosya ek olarak gönderilmiştir.</strong></p>` : ''}
      </div>
    </body>
    </html>
  `;

  return emailHTML;
};

// Müşteri onay maili formatı
const formatCustomerConfirmationEmail = (formData) => {
  const currentDate = new Date().toLocaleString('tr-TR');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { 
          background: linear-gradient(135deg, #1e3a8a, #f97316); 
          color: white; 
          padding: 30px 20px; 
          border-radius: 12px; 
          margin-bottom: 30px;
          text-align: center;
        }
        .content { background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 20px; }
        .reference-box { 
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: center;
          margin: 20px 0;
          border: 3px solid #fed7aa;
        }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 12px 0; 
          border-bottom: 1px solid #e5e7eb;
        }
        .info-label { font-weight: 600; color: #1e3a8a; }
        .info-value { color: #374151; }
        .footer { 
          background: #1e3a8a; 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: center;
          font-size: 14px;
        }
        .highlight { color: #f97316; font-weight: 600; }
        .company-name { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">🏗️ AZAKLAR İNŞAAT</div>
          <h1 style="margin: 0; font-size: 28px;">Başvurunuz Alındı!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Kentsel Dönüşüm Danışmanlık Talebi</p>
        </div>

        <div class="content">
          <h2 style="color: #1e3a8a; margin-top: 0;">Sayın ${formData.step1?.adSoyad || 'Değerli Müşterimiz'},</h2>
          
          <p>Kentsel dönüşüm danışmanlığı başvurunuz başarıyla tarafımıza ulaşmıştır. 
                             <span class="highlight">40+ yıllık deneyimimiz</span> ile size en iyi hizmeti sunmak için 
             uzman ekibimiz başvurunuzu değerlendirmektedir.</p>

          <div class="reference-box">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">📋 BAŞVURU REFERANS NUMARANIZ</h3>
            <div style="font-size: 32px; font-weight: 700; letter-spacing: 2px;">
              ${formData.referenceId}
            </div>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
              Bu numarayı kaydedin, iletişimde kullanılacaktır.
            </p>
          </div>

          <h3 style="color: #1e3a8a; margin-bottom: 15px;">📝 Başvuru Özeti</h3>
          
          <div class="info-row">
            <span class="info-label">Başvuru Tarihi:</span>
            <span class="info-value">${currentDate}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">İletişim Bilgileri:</span>
            <span class="info-value">${formData.step1?.telefon || '-'}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Gayrimenkul Konumu:</span>
            <span class="info-value">İstanbul / ${formData.step2?.ilce || '-'}</span>
          </div>
          
          <div class="info-row" style="border-bottom: none;">
            <span class="info-label">Bina Yaşı:</span>
            <span class="info-value">${formData.step3?.binaYasi ? formData.step3.binaYasi + ' yıl' : '-'}</span>
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-weight: 600; color: #92400e;">
              ⏰ <strong>Sonraki Adım:</strong> Uzman ekibimiz en geç <span class="highlight">24 saat içinde</span> 
              sizinle iletişime geçerek danışmanlık sürecini başlatacaktır.
            </p>
          </div>

          <h3 style="color: #1e3a8a; margin-bottom: 15px;">🎯 Size Özel Hizmetlerimiz</h3>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li><strong>Ücretsiz İlk Danışmanlık:</strong> Mevzuat ve süreç bilgilendirmesi</li>
            <li><strong>Fizibilite Analizi:</strong> Projenizin karlılık değerlendirmesi</li>
            <li><strong>Süreç Yönetimi:</strong> A'dan Z'ye kentsel dönüşüm koordinasyonu</li>
            <li><strong>Hukuki Destek:</strong> Tüm yasal süreçlerde uzman desteği</li>
          </ul>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;"><strong>📞 Acil Durum İletişim</strong></p>
          <p style="margin: 0 0 15px 0;">
            Tel: <span class="highlight">(212) 555 03-96</span> | 
            E-posta: <span class="highlight">kentsel@azaklaryapi.com</span>
          </p>
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">
            Bu mail otomatik olarak gönderilmiştir. Azaklar İnşaat - Güvenilir İnşaat Çözümleri
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API Endpoints
app.post('/api/send-kentsel-email', upload.any(), async (req, res) => {
  let uploadedFiles = [];
  
  try {
    // Rate limiting kontrolü
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Çok fazla upload denemesi. Lütfen 5 dakika sonra tekrar deneyin.'
      });
    }

    // Form verilerini parse et
    const formData = JSON.parse(req.body.formData || '{}');
    uploadedFiles = req.files || [];
    
    if (!formData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Form verisi bulunamadı' 
      });
    }

    // Dosya boyut kontrolü
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    const maxSize = 15 * 1024 * 1024; // 15MB
    
    if (totalSize > maxSize) {
      // Dosyaları temizle
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: `Toplam dosya boyutu ${(maxSize / 1024 / 1024).toFixed(0)}MB sınırını aşıyor`
      });
    }

    console.log('📤 Mail gönderiliyor...', {
      referenceId: formData.referenceId,
      customerEmail: formData.step1?.email || 'Belirtilmemiş',
      filesCount: uploadedFiles.length,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)}MB`
    });

    // E-mail gönder (hem company hem customer)
    const results = await sendContactEmail(formData, uploadedFiles);
    
    // Temp dosyaları temizle
    cleanupFiles(uploadedFiles);
    
    const companyResult = results.find(r => r.type === 'company');
    const customerResult = results.find(r => r.type === 'customer');
    
    console.log('✅ Mailler başarıyla gönderildi:', {
      company: {
        messageId: companyResult?.messageId,
        response: companyResult?.response,
      },
      customer: {
        sent: !!customerResult,
        messageId: customerResult?.messageId,
        email: formData.step1?.email
      },
      referenceId: formData.referenceId,
      attachments: uploadedFiles.length
    });

    res.json({ 
      success: true, 
      message: `Mail başarıyla gönderildi${customerResult ? ' (müşteriye de onay maili gönderildi)' : ''}`,
      company: {
        messageId: companyResult?.messageId,
        sent: true
      },
      customer: {
        sent: !!customerResult,
        email: formData.step1?.email
      },
      referenceId: formData.referenceId,
      attachments: uploadedFiles.length
    });

  } catch (error) {
    console.error('❌ Mail gönderme hatası:', error);
    
    // Hata durumunda dosyaları temizle
    if (uploadedFiles.length > 0) {
      cleanupFiles(uploadedFiles);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'E-mail gönderilemedi',
      error: error.message 
    });
  }
});

// İletişim Formu Template'leri
const formatContactEmailForCompany = (formData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Yeni İletişim Mesajı</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .info-section { margin-bottom: 25px; }
        .info-section h3 { color: #1e3a8a; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: bold; color: #4b5563; width: 120px; }
        .info-value { color: #1f2937; flex: 1; }
        .message-box { background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 20px; margin-top: 20px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Yeni İletişim Mesajı</h1>
          <p>Web sitesi iletişim formundan yeni bir mesaj alındı</p>
        </div>
        
        <div class="content">
          <div class="info-section">
            <h3>👤 Gönderen Bilgileri</h3>
            <div class="info-row">
              <div class="info-label">Ad Soyad:</div>
              <div class="info-value">${formData.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">E-posta:</div>
              <div class="info-value">${formData.email}</div>
            </div>
            ${formData.phone ? `
            <div class="info-row">
              <div class="info-label">Telefon:</div>
              <div class="info-value">${formData.phone}</div>
            </div>` : ''}
            <div class="info-row">
              <div class="info-label">Konu:</div>
              <div class="info-value">${formData.subject}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Tarih:</div>
              <div class="info-value">${new Date().toLocaleString('tr-TR')}</div>
            </div>
          </div>

          <div class="info-section">
            <h3>💬 Mesaj İçeriği</h3>
            <div class="message-box">
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div class="info-section">
            <h3>📞 Yanıt Verme</h3>
            <p>Bu müşteriye en kısa sürede dönüş yapınız:</p>
            <p><strong>E-posta:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            ${formData.phone ? `<p><strong>Telefon:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>` : ''}
          </div>
        </div>
        
        <div class="footer">
          <p><strong>AZAKLAR YAPI SANAYİ TİC. LTD. ŞTİ</strong></p>
          <p>Şevketdağ Cd. No:18/A Güngören / Haznedar / İSTANBUL</p>
          <p>Tel: (212) 555 03-96 | E-posta: kentsel@azaklaryapi.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const formatContactConfirmationForCustomer = (formData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mesajınız Alındı</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .success-box { background: #10b981; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .info-section { margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 10px; }
        .info-section h3 { color: #1e3a8a; margin-bottom: 15px; font-size: 18px; }
        .contact-info { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 20px; margin-top: 20px; }
        .contact-info h4 { color: #92400e; margin-bottom: 15px; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Mesajınız Alındı</h1>
          <p>Azaklar İnşaat'a başarıyla ulaştınız</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h2>🎉 Teşekkür Ederiz ${formData.name}!</h2>
            <p>Mesajınız başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.</p>
          </div>

          <div class="info-section">
            <h3>📋 Mesaj Özeti</h3>
            <p><strong>Konu:</strong> ${formData.subject}</p>
            <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
            <p><strong>İletişim E-posta:</strong> ${formData.email}</p>
          </div>

          <div class="info-section">
            <h3>⏰ Ne Zaman Dönüş Alabilirim?</h3>
            <p>• <strong>Çalışma saatleri içinde:</strong> 2-4 saat içinde</p>
            <p>• <strong>Çalışma saatleri dışında:</strong> Bir sonraki iş günü</p>
            <p>• <strong>Acil durumlar için:</strong> Telefon numaramızı arayabilirsiniz</p>
          </div>

          <div class="contact-info">
            <h4>📞 Bizimle İletişim</h4>
            <p><strong>Telefon:</strong> (212) 555 03-96</p>
            <p><strong>E-posta:</strong> kentsel@azaklaryapi.com</p>
            <p><strong>Adres:</strong> Şevketdağ Cd. No:18/A Güngören / Haznedar / İSTANBUL</p>
            <p><strong>Çalışma Saatleri:</strong></p>
            <p>• Pazartesi - Cuma: 08:00 - 18:00</p>
            <p>• Cumartesi: 09:00 - 16:00</p>
            <p>• Pazar: Kapalı</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>AZAKLAR YAPI SANAYİ TİC. LTD. ŞTİ</strong></p>
                          <p>40 yıllık deneyimimizle kaliteli hizmet</p>
          <p>www.azaklaryapi.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// İletişim Formu Endpoint'i
app.post('/api/send-contact-email', async (req, res) => {
  try {
    console.log('🔍 İletişim formu endpoint çağrıldı');
    console.log('📋 Gelen req.body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Gerekli alanlar eksik'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz e-posta adresi'
      });
    }

    const formData = { name, email, phone, subject, message };
    const results = [];

    // 1. Firmaya detaylı mail
    console.log('🏢 Company mail için formData:', formData);
    const companyEmailHTML = formatContactEmailForCompany(formData);
    console.log('📧 Company email HTML uzunluğu:', companyEmailHTML.length);
    console.log('📧 Company email HTML başlangıcı:', companyEmailHTML.substring(0, 200));
    
    const companyMailOptions = {
      from: '"Web Sitesi İletişim" <kentsel@azaklaryapi.com>',
      to: 'kentsel@azaklaryapi.com',
      subject: `Yeni İletişim Mesajı - ${subject}`,
      html: companyEmailHTML,
      replyTo: email
    };

    console.log('📤 Company mail gönderiliyor...');
    const companyResult = await transporter.sendMail(companyMailOptions);
    console.log('✅ Company mail sonucu:', companyResult.messageId);
    results.push({ type: 'company', success: true, messageId: companyResult.messageId });

    // 2. Müşteriye onay maili
    const customerEmailHTML = formatContactConfirmationForCustomer(formData);
    
    const customerMailOptions = {
      from: '"Azaklar İnşaat" <kentsel@azaklaryapi.com>',
      to: email,
      subject: 'Mesajınız Alındı - Azaklar İnşaat',
      html: customerEmailHTML
    };

    try {
      const customerResult = await transporter.sendMail(customerMailOptions);
      results.push({ type: 'customer', success: true, messageId: customerResult.messageId });
    } catch (customerError) {
      console.error('❌ Müşteri mail hatası:', customerError);
      results.push({ type: 'customer', success: false, error: customerError.message });
    }

    console.log('✅ İletişim formu maili gönderildi:', {
      from: email,
      subject: subject,
      company: companyResult.messageId,
      customer: results.find(r => r.type === 'customer')?.success || false
    });

    res.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi',
      results
    });

  } catch (error) {
    console.error('❌ İletişim formu mail hatası:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'E-mail gönderilemedi',
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mail server is running' });
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🚀 Mail server ${PORT} portunda çalışıyor`);
  console.log(`📧 SMTP: mail.kurumsaleposta.com`);
  console.log(`✉️  Mail: kentsel@azaklaryapi.com`);
}); 