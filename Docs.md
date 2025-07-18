# Azaklar İnşaat Kurumsal Web Sitesi Dökümanı

## 🏗️ Proje Özeti

**Firma Adı:** Azaklar İnşaat  
**Proje Türü:** Kurumsal Web Sitesi  
**Teknoloji Stack:** React + Vite + Tailwind CSS + .NET Core API  
**Hedef:** Statik, modern ve kurumsal bir web sitesi

## 🎨 Tasarım Konsepti

### Ana Tema
- **Mimari Mükemmellik:** Site, bir yapının inşasında gösterilen titizlik ve özenle tasarlanacak
- **Güven ve Kalite:** Sektörde tanınan bir markanın prestijini yansıtacak
- **Modern Minimalizm:** Sade, anlaşılır ve etkileyici tasarım

### Renk Paleti
- **Ana Renkler:**
  - Lacivert (#1e3a8a, #1e40af) - Güven, profesyonellik
  - Turuncu (#f97316) - Enerji, yenilik
- **Destekleyici Renkler:**
  - Beyaz (#ffffff) - Temizlik, açıklık
  - Gri tonları (#f8fafc, #64748b) - Denge, sofistikasyon
  - Koyu gri (#1e293b) - Metin ve detaylar

## 🎨 TASARİM BÜTÜNLÜĞÜ VE STİL REHBERİ

### ⚠️ **KRİTİK ÖNEMLİ: Tutarlılık İlkeleri**

#### **1. Renk Tutarlılığı**
- **Ana Lacivert:** `#1e3a8a` ve `#1e40af` - Tüm sayfalarda aynı tonlar
- **Turuncu Accent:** `#f97316` - Vurgu ve CTA elementlerde
- **YASAK:** Farklı mavi tonları (`blue-600`, `blue-800` vs.) kullanmak

#### **2. Header Tasarım Standardı**
- **Tüm alt sayfalarda:** ProjectDetail ile aynı header tasarımı
- **Background:** `bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900`
- **Pattern:** SVG architectural pattern overlay
- **Overlay:** `bg-black bg-opacity-20`
- **Typography:** Gradient text effect (`from-white to-orange-200`)

#### **3. Kart Tasarım Standardı**
- **CSS Class:** `project-card` (Ana CSS'te tanımlı)
- **Hover Effects:** Transform ve shadow animasyonları
- **Image:** `project-image` ve `project-overlay` class'ları
- **Stats:** `project-stats`, `stat`, `stat-value`, `stat-label` yapısı
- **YASAK:** Custom Tailwind classes ile farklı kart tasarımları

#### **4. Component Tutarlılığı**
- **Button Styles:** Ana CSS'teki `.btn` class'larını kullan
- **Typography:** Heading ve text class'ları tutarlı olmalı
- **Spacing:** `section-padding`, `container-custom` gibi global class'lar
- **Icons:** Consistent icon sizing ve color palette

### **Tasarım Kontrolü Checklist:**
- [ ] Renk paleti ana sayfa ile tutarlı mı?
- [ ] Header tasarımı ProjectDetail ile aynı mı?
- [ ] Kart tasarımları FeaturedProjects ile uyumlu mu?
- [ ] Button stilleri global CSS class'larını kullanıyor mu?
- [ ] Typography hiyerarşisi tutarlı mı?
- [ ] Icon renkleri ve boyutları standart mı?

### **Geliştirici Notları:**
- Her yeni sayfa eklendiğinde bu rehbere uygunluk kontrol edilmeli
- Custom style'lar yerine mevcut CSS class'ları tercih edilmeli
- Renk değişiklikleri tüm sayfalarda sync edilmeli
- Component library mantığıyla çalışılmalı

## 🗺️ Site Haritası

### Ana Sayfalar
1. **Ana Sayfa (Home)** ✅
   - Hero bölümü (logo, slogan, temel mesaj)
   - Hizmetler özeti
   - Öne çıkan projeler galerisi
   - Süreç adımları (planlama, tasarım, inşaat, teslim)
   - Firma değerleri ve ilkeler

2. **Hakkımızda (About)** ✅
   - Firma hikayesi ve 40 yıllık deneyim
   - Misyon ve vizyon
   - Firma değerleri (Güvenilirlik, İnovasyon, Müşteri Memnuniyeti, Sürekli Gelişim)
   - Görsel galeri (ofis, ekipman, çalışma alanları)

3. **Hizmetler (Services)** ✅
   - Konut projeleri
   - Ticari yapılar
   - Tadilat ve renovasyon
   - Proje yönetimi
   - Mühendislik danışmanlığı

4. **Projeler (Projects)** ✅
   - Tamamlanan projeler galerisi
   - Devam eden projeler
   - Akıllı filtreleme sistemi (proje türü, yıl, konum)
   - Detay sayfaları

5. **İletişim (Contact)** ✅
   - İletişim formu (API entegrasyonu ile)
   - Adres ve harita
   - Telefon ve e-posta bilgileri
   - Firma bilgileri

6. **Kentsel Dönüşüm Danışmanlığı** ✅
   - 7 adımlı wizard form
   - Dosya yükleme sistemi
   - Email gönderimi (.NET API ile)

## 🏗️ Teknik Spesifikasyonlar

### Frontend Stack
- **React 19.1.0** - Modern komponent yapısı
- **Vite** - Hızlı build ve development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM (HashRouter)** - Sayfa yönlendirme (SPA routing için)
- **Framer Motion** - Animasyonlar
- **React Icons** - İkon kütüphanesi
- **Tsparticles** - Parçacık efektleri

### Backend Stack
- **.NET Core 8.0** - Modern API framework
- **MailKit & MimeKit** - Email gönderimi
- **CORS** - Cross-origin resource sharing
- **Swagger** - API dokümantasyonu
- **Health Checks** - Sistem durumu kontrolü

### Özellikler
- Tamamen responsive tasarım
- SEO optimizasyonu (her sayfa için meta tags)
- Performance optimizasyonu
- Accessibility (WCAG 2.1)
- Progressive Web App (PWA) özellikleri
- Email form entegrasyonu
- HashRouter ile SPA routing (sayfa yenileme sorunu çözüldü)

## 🎯 Kullanıcı Deneyimi (UX) Yaklaşımı

### Hedef Kitle
- Ev sahibi olmak isteyenler
- Yatırımcılar
- Ticari müşteriler
- Diğer inşaat firmaları (B2B)

### UX Prensipleri
1. **Güven İnşası:** Kaliteli proje görselleri, firma değerleri, deneyim vurgusu
2. **Kolay Navigasyon:** Sade menü yapısı, breadcrumb
3. **Hızlı Erişim:** Önemli bilgilere 3 tıkla ulaşım
4. **Görsel Etki:** Kaliteli proje fotoğrafları ve süreç görselleri
5. **Kolay İletişim:** Her sayfada iletişim bilgileri

## 📱 Responsive Tasarım

### Breakpoint'ler
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px - 1920px
- **Large Desktop:** 1920px+

### Mobil Öncelikli Yaklaşım
- Touch-friendly butonlar
- Swipe gestures proje galerisinde
- Optimized loading times
- Compressed images

## ⚡ Performans Hedefleri

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimizasyon Stratejileri
- Image lazy loading
- Code splitting
- Bundle size optimization
- CDN kullanımı

## 🚀 Geliştirme Süreci

### Aşama 1: Proje Kurulumu ✅
- [x] Vite + React projesini oluştur
- [x] Tailwind CSS kurulumu
- [x] Gerekli paketleri yükle (React Router, Framer Motion, React Icons, Particles)
- [x] Proje yapısını organize et

### Aşama 2: Temel Bileşenler ✅
- [x] Header/Navigation komponenti (modern, 3D efektli, responsive)
- [x] Footer komponenti
- [x] Layout komponenti
- [x] Button komponenti
- [x] Card komponenti

### Aşama 3: Ana Sayfa Geliştirme ✅
- [x] Hero bölümü (3D mouse tracking efektli, modern çerçeveli tasarım)
- [x] Hizmetler section (6 hizmet kartı, CTA butonları ile)
- [x] Öne çıkan projeler galerisi (3 proje: Haznedar Park, Bağcılar Meydan Life, Fatih Gülbahçe)
- [x] Süreç adımları section
- [x] Firma değerleri section

### Aşama 4: İç Sayfalar ✅
- [x] Hakkımızda sayfası (firma hikayesi, değerler, görsel galeri)
- [x] Hizmetler sayfası (detaylı hizmet açıklamaları)
- [x] Projeler sayfası (akıllı filtre sistemi ve modern tasarım)
- [x] Proje detay sayfası (ProjectDetail.jsx - detaylı proje bilgileri)
- [x] Kentsel Dönüşüm Danışmanlık sayfası (7 adımlı wizard form)
- [x] İletişim sayfası (form, harita, firma bilgileri)

### Aşama 5: Backend Entegrasyonu ✅
- [x] .NET Core API kurulumu
- [x] Email servisi (MailKit ile)
- [x] CORS konfigürasyonu
- [x] API endpoint'leri (contact, kentsel-donusum)
- [x] Frontend API entegrasyonu
- [x] Deploy sistemi

### Aşama 6: SEO ve Optimizasyon ✅
- [x] Her sayfa için özel meta tags
- [x] Open Graph ve Twitter meta tags
- [x] Performance optimization
- [x] Image optimization
- [x] Mobile responsiveness test

### Aşama 7: Deployment ✅
- [x] Frontend deploy (FTP ile)
- [x] API deploy (.NET Core)
- [x] Domain konfigürasyonu
- [x] SSL sertifika ayarları
- [x] HashRouter ile SPA routing çözümü

### Aşama 8: Güvenlik ve Temizlik ✅
- [x] Debug loglarının temizlenmesi
- [x] Hassas bilgilerin güvenli hale getirilmesi
- [x] Production-ready kod optimizasyonu
- [x] Error handling iyileştirmeleri

## 📝 İçerik Yapısı

### Firma Bilgileri
- Kuruluş yılı: 40+ yıl deneyim
- Faaliyet alanları: Konut, ticari, kentsel dönüşüm
- Firma değerleri: Güvenilirlik, İnovasyon, Müşteri Memnuniyeti, Sürekli Gelişim
- Çalışma prinsipleri: Kalite odaklı yaklaşım

### Proje Kategorileri
- Konut projeleri (Haznedar Park, Bağcılar Meydan Life)
- Villa ve müstakil evler
- Ticari yapılar
- Endüstriyel tesisler
- Tadilat ve renovasyon
- Tarihi restorasyon (Fatih Gülbahçe Konağı)

### Görsel İçerik
- Proje görselleri ve fotoğrafları (80+ fotoğraf)
- Süreç adımları görselleri
- Teknoloji ve ekipman fotoğrafları
- Öncesi/sonrası karşılaştırmaları
- Ofis ve çalışma alanları

## 🎨 Tasarım Öğeleri

### Tipografi
- **Başlık:** Inter/Poppins - Modern, okunaklı
- **Metin:** System fonts - Hızlı yüklenme
- **Boyutlar:** Responsive typography scale

### İkonlar
- Modern, minimalist line icons (React Icons)
- Consistent style
- Inşaat sektörüne uygun

### Animasyonlar
- Smooth page transitions (Framer Motion)
- Hover effects
- Scroll-triggered animations
- Loading animations

## 🔧 Geliştirme Notları

### Klasör Yapısı
```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── sections/
│       ├── Hero.jsx
│       ├── Services.jsx
│       ├── FeaturedProjects.jsx
│       ├── ProcessSteps.jsx
│       └── CompanyValues.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── Contact.jsx
│   └── KentselDonusumForm.jsx
├── config/
│   ├── api.js
│   └── email.js
├── assets/
│   ├── bagcilar_meydan_life/
│   ├── fatih_gulbahce_konagi/
│   └── haznedar_park/
├── hooks/
├── utils/
└── styles/
```

### Backend Yapısı
```
AzaklarApi/
├── Controllers/
│   ├── EmailController.cs
│   └── WeatherForecastController.cs
├── Services/
│   └── EmailService.cs
├── Models/
│   ├── ContactRequest.cs
│   ├── KentselDonusumRequest.cs
│   └── ApiResponse.cs
├── Program.cs
└── appsettings.json
```

### Kodlama Standartları
- ESLint + Prettier
- Component naming conventions
- Consistent file structure
- Code comments (Türkçe)
- API error handling
- Form validation

### Git Workflow
- Feature branches
- Descriptive commit messages
- Code review process

## 🎯 Başarı Metrikleri

### Teknik Metrikler
- Page load time < 3 saniye
- Mobile-friendly score 100/100
- Accessibility score 90+
- SEO score 90+

### İş Metrikleri
- Profesyonel görünüm
- Kolay navigasyon
- Etkili proje sunumu
- Güven verici tasarım
- Görsel etki ve çekicilik

---

## 📈 Mevcut Proje Durumu (Son Güncelleme: Aralık 2024)

### ✅ **Tamamlanan Özellikler:**

#### **Frontend Altyapısı:**
- React 19.1.0 + Vite kurulumu
- Tailwind CSS ile utility-first styling
- React Router DOM (HashRouter) ile routing sistemi
- Framer Motion ile animasyonlar
- React Icons kütüphanesi
- Tsparticles ile parçacık efektleri

#### **Bileşen Mimarisi:**
- **Layout Sistemi:** Header, Footer, Layout bileşenleri
- **Ortak Bileşenler:** Button, Card (common klasöründe)
- **Section Bileşenleri:** Hero, Services, FeaturedProjects, ProcessSteps, CompanyValues

#### **Ana Sayfa Özellikleri:**
- **Hero Section:** 3D mouse tracking efekti, modern çerçeveli tasarım
- **Hizmetler:** 6 farklı hizmet kartı (Konut, Kentsel Dönüşüm, Tadilat, vb.)
- **Öne Çıkan Projeler:** 3 tamamlanmış proje showcase'i
- **Süreç Adımları:** İnşaat süreç akışı
- **Firma Değerleri:** Kurumsal değerler sunumu

#### **İç Sayfalar:**
- **Hakkımızda:** Firma hikayesi, 40 yıllık deneyim, değerler
- **Projeler:** Akıllı filtre sistemi, modern tasarım
- **Proje Detay:** Detaylı proje bilgileri ve galeri
- **İletişim:** Form, harita, firma bilgileri
- **Kentsel Dönüşüm:** 7 adımlı wizard form

#### **Backend Sistemi:**
- **.NET Core 8.0 API:** Modern backend framework
- **Email Servisi:** MailKit ile SMTP entegrasyonu (465 portu)
- **CORS Konfigürasyonu:** Güvenli cross-origin istekler
- **API Endpoint'leri:** Contact ve Kentsel Dönüşüm formları
- **Health Checks:** Sistem durumu kontrolü
- **Validation:** Form validasyonu ve hata mesajları

#### **Proje Verileri:**
- **Haznedar Park:** 16 daire, 6 kat, Güngören
- **Bağcılar Meydan Life:** 28 daire, 12 kat, Bağcılar  
- **Fatih Gülbahçe Konağı:** Tarihi restorasyon projesi

#### **SEO ve Performance:**
- Her sayfa için özel meta tags
- Open Graph ve Twitter meta tags
- Performance optimizasyonu
- Mobile-first responsive tasarım

#### **Deploy Sistemi:**
- Frontend: FTP ile deploy
- Backend: .NET Core API deploy
- Domain: azaklaryapi.com
- SSL sertifika konfigürasyonu
- HashRouter ile SPA routing çözümü

#### **Güvenlik ve Temizlik:**
- Debug loglarının temizlenmesi
- Production-ready kod optimizasyonu
- Error handling iyileştirildi

### 🚧 **Devam Eden/Planlanan İşler:**

1. **Performance Monitoring:** Google Analytics ve Core Web Vitals takibi
2. **Content Updates:** Yeni projeler ve güncellemeler
3. **Security Hardening:** API güvenlik optimizasyonları
4. **Backup Strategy:** Veri yedekleme stratejisi

### 💡 **Teknik Notlar:**
- Proje assets klasöründe 3 proje için toplam 80+ fotoğraf mevcut
- CSS dosyası 834 satır, modern utility classlar ile
- Component-based architecture kullanılıyor
- Modern ES6+ syntax ve hooks kullanılıyor
- .NET Core API ile email entegrasyonu tamamlandı
- CORS ve güvenlik başlıkları konfigüre edildi
- HashRouter ile sayfa yenileme sorunu çözüldü

### 🔗 **API Endpoints:**
- `POST /api/email/send-contact-email` - İletişim formu
- `POST /api/email/send-kentsel-email` - Kentsel dönüşüm formu
- `GET /api/email/health` - Sistem durumu
- `GET /health` - Health check

### 📊 **Deploy Bilgileri:**
- **Frontend:** 94.73.149.144 (u7386832)
- **Backend:** 94.73.149.144 (apiazaklaryapi)
- **Domain:** azaklaryapi.com
- **SSL:** Aktif
- **Routing:** HashRouter (SPA routing)

### 🔧 **Son Yapılan Güncellemeler:**

#### **Proje Detay Sayfası API Entegrasyonu:**
- ✅ API endpoint'i localhost'a çevrildi: `http://localhost:5177/api/projects/{slug}`
- ✅ API response yapısı düzeltildi: `{ success: true, data: project }`
- ✅ Status badge sistemi enum değerleriyle güncellendi (1, 2, 3)
- ✅ İstatistik sistemi API'den gelen stats array'i kullanacak şekilde düzenlendi
- ✅ Resim URL'leri localhost'a çevrildi
- ✅ Açıklama alanları düzenlendi: Liste → description, Detay → fullDescription

#### **Projeler Sayfası Filtre Tasarımı:**
- ✅ Select dropdown yerine modern buton tasarımı
- ✅ Tüm enum durumları eklendi: Tüm Projeler, Devam Eden, Tamamlanan, Gelecek
- ✅ Renk paleti uygulama geneline uygun hale getirildi
- ✅ Dinamik sayaçlar her kategori için proje sayısını gösteriyor
- ✅ Hover efektleri ve smooth transitions eklendi

#### **Modern Tasarım İyileştirmeleri:**
- ✅ ProjectDetail sayfası pd_detail.md tasarımına uygun olarak yeniden yazıldı
- ✅ Hero header gradient background ve pattern overlay
- ✅ 3 kolonlu layout sistemi (2:1 oranında)
- ✅ Modern galeri tasarımı ve lightbox sistemi
- ✅ Framer Motion animasyonları ve AnimatePresence

#### **API Test Sonuçları:**
- ✅ API çalışıyor: `http://localhost:5177/api/projects`
- ✅ Slug ile proje getirme çalışıyor
- ✅ 3 proje mevcut: Haznedar Park A, Bağcılar Meydan Life, Fatih Gülbahçe Konağı
- ✅ Proje detay sayfasına yönlenme sorunu çözüldü

#### **Routing Çözümü:**
- BrowserRouter → HashRouter geçişi
- Sayfa yenileme sorunu çözüldü
- URL'ler: `/#/iletisim`, `/#/hakkimizda` formatında

#### **Form Validation:**
- Kentsel dönüşüm formunda zorunlu alan kontrolü
- Backend validation kuralları
- Frontend-backend uyumu sağlandı

#### **Email Sistemi:**
- SMTP 465 portu ile çalışıyor
- MailKit entegrasyonu
- Company ve customer confirmation email'leri

#### **Güvenlik:**
- Debug logları temizlendi
- Production-ready kod
- Error handling iyileştirildi

---

*Bu döküman, Azaklar İnşaat kurumsal web sitesinin geliştirilmesi için temel rehber niteliğindedir. Geliştirme sürecinde gerekli güncellemeler yapılacaktır.*
