# 🏗️ Azaklar İnşaat Kurumsal Web Sitesi

Modern React + Vite + Tailwind CSS ile geliştirilmiş, tam özellikli kurumsal web sitesi.

## ✨ Özellikler

- 🎨 **Modern Tasarım:** 3D efektler, animasyonlar ve responsive tasarım
- 📝 **Kentsel Dönüşüm Formu:** 7 adımlı wizard form + validasyon
- 📎 **Dosya Yükleme:** Güvenli dosya upload + mail attachment (15MB limit)
- 📧 **Mail Entegrasyonu:** SMTP + HTML template + attachments
- 🏗️ **Proje Galerisi:** Tamamlanan projeler showcase'i
- 🔒 **Güvenlik:** Rate limiting, file validation, sanitization
- ⚡ **Performans:** Optimized loading ve modern web standartları

## 🚀 Kurulum

### 1. Dependencies Yükle
```bash
npm install
```

### 2. Environment Dosyası (.env.local)
```env
VITE_API_URL=http://localhost:3001
```

### 3. Geliştirme Sunucularını Başlat

#### Frontend + Backend birlikte:
```bash
npm run dev:full
```

#### Sadece Frontend:
```bash
npm run dev
```

#### Sadece Backend (Mail Server):
```bash
npm run server
```

## 📧 Mail Konfigürasyonu

Mail servisi `server/index.js` dosyasında yapılandırılmıştır:
- **SMTP:** mail.kurumsaleposta.com
- **Port:** 587
- **Mail:** kentsel@azaklaryapi.com
- **Güvenlik:** Backend'de şifrelenmiş
- **Dual Mail System:** Hem firmaya hem müşteriye gönderim

### 📬 İkili Mail Sistemi

**1. Firma Maili (kentsel@azaklaryapi.com):**
- Detaylı form bilgileri
- Tüm dosya attachments
- Professional HTML template

**2. Müşteri Onay Maili:**
- Başvuru onayı + referans ID
- Özet bilgiler
- 24 saat iletişim garantisi
- Attachment'sız (temiz inbox)

### 📎 Dosya Yükleme Limitleri

- **Toplam Limit:** 15MB (mail uyumlu)
- **Tapu Görseli:** Tek dosya, 2MB max (JPG, PNG)
- **Bina Fotoğrafları:** Çoklu dosya, 8MB max (JPG, PNG, WEBP)
- **Diğer Belgeler:** Çoklu dosya, 5MB max (PDF, DOCX, XLSX)

### 🔒 Güvenlik Önlemleri

- Dosya tipi validasyonu (MIME + extension)
- Dosya adı sanitization
- Rate limiting (5dk/10 upload)
- Yasaklı dosya uzantıları filtresi
- Güvenlik header'ları

## 🏗️ Proje Yapısı

```
src/
├── components/
│   ├── common/          # Ortak bileşenler
│   ├── layout/          # Layout bileşenleri
│   └── sections/        # Sayfa section'ları
├── pages/
│   ├── Home.jsx         # Ana sayfa
│   ├── ProjectDetail.jsx
│   └── KentselDonusumForm.jsx
├── config/
│   └── email.js         # Mail API entegrasyonu
└── assets/              # Proje görselleri

server/
└── index.js             # Express mail server
```

## 🎯 API Endpoints

- `POST /api/send-contact-email` - Form mail gönderimi
- `GET /api/health` - Server durum kontrolü

## 🛠️ Teknolojiler

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Express.js, Nodemailer
- **Animasyon:** Framer Motion
- **Icons:** React Icons
- **Routing:** React Router DOM

## 📱 Responsive Tasarım

- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

## 🔧 Geliştirme Notları

- Form validasyonu her adımda çalışır
- SMTP bilgileri backend'de güvenli şekilde saklanır
- Mail gönderimi API üzerinden gerçekleşir
- Dosyalar temp klasöre kaydedilip mail sonrası silinir
- Multer ile dosya upload güvenli şekilde handle edilir
- Frontend FormData ile backend'e dosyalar gönderir
- Proje görselleri assets klasöründe organize edilmiştir

### 📁 Dosya Upload Akışı

1. **Frontend:** Dosya seçimi + validation
2. **FormData:** Dosyalar + form verisi birleştirme  
3. **Backend:** Multer + güvenlik kontrolleri
4. **Temp Save:** uploads/ klasörüne geçici kayıt
5. **Mail Send:** Nodemailer ile attachment
6. **Cleanup:** Temp dosyaları otomatik silme
