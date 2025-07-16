# Azaklar İnşaat Kurumsal Web Sitesi Dökümanı

## 🏗️ Proje Özeti

**Firma Adı:** Azaklar İnşaat  
**Proje Türü:** Kurumsal Web Sitesi  
**Teknoloji Stack:** React + Vite + Tailwind CSS  
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
1. **Ana Sayfa (Home)**
   - Hero bölümü (logo, slogan, temel mesaj)
   - Hizmetler özeti
   - Öne çıkan projeler galerisi
   - Süreç adımları (planlama, tasarım, inşaat, teslim)
   - Firma değerleri ve ilkeler

2. **Hakkımızda (About)**
   - Firma hikayesi
   - Misyon ve vizyon
   - Teknoloji ve yöntemler
   - Görsel galeri (ofis, ekipman, çalışma alanları)

3. **Hizmetler (Services)**
   - Konut projeleri
   - Ticari yapılar
   - Tadilat ve renovasyon
   - Proje yönetimi
   - Mühendislik danışmanlığı

4. **Projeler (Projects)**
   - Tamamlanan projeler galerisi
   - Devam eden projeler
   - Filtreleme (proje türü, yıl, konum)
   - Detay sayfaları

5. **İletişim (Contact)**
   - İletişim formu
   - Adres ve harita
   - Telefon ve e-posta
   - Sosyal medya linkleri

## 🏗️ Teknik Spesifikasyonlar

### Frontend Stack
- **React 18+** - Modern komponent yapısı
- **Vite** - Hızlı build ve development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Sayfa yönlendirme
- **Framer Motion** - Animasyonlar
- **React Icons** - İkon kütüphanesi

### Özellikler
- Tamamen responsive tasarım
- SEO optimizasyonu
- Performance optimizasyonu
- Accessibility (WCAG 2.1)
- Progressive Web App (PWA) özellikleri

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

### Aşama 1: Proje Kurulumu
- [x] Vite + React projesini oluştur
- [x] Tailwind CSS kurulumu
- [x] Gerekli paketleri yükle (React Router, Framer Motion, React Icons, Particles)
- [x] Proje yapısını organize et

### Aşama 2: Temel Bileşenler
- [x] Header/Navigation komponenti (modern, 3D efektli, responsive)
- [x] Footer komponenti
- [x] Layout komponenti
- [x] Button komponenti
- [x] Card komponenti

### Aşama 3: Ana Sayfa Geliştirme
- [x] Hero bölümü (3D mouse tracking efektli, modern çerçeveli tasarım)
- [x] Hizmetler section (6 hizmet kartı, CTA butonları ile)
- [x] Öne çıkan projeler galerisi (3 proje: Haznedar Park, Bağcılar Meydan Life, Fatih Gülbahçe)
- [x] Süreç adımları section
- [x] Firma değerleri section

### Aşama 4: İç Sayfalar
- [ ] Hakkımızda sayfası (placeholder mevcut)
- [ ] Hizmetler sayfası (placeholder mevcut)
- [x] Projeler sayfası (Projects.jsx - Modern filtre sistemi ve tasarım bütünlüğü ile tamamlandı)
- [x] Proje detay sayfası (ProjectDetail.jsx oluşturuldu)
- [x] Kentsel Dönüşüm Danışmanlık sayfası (KentselDonusumForm.jsx - form wizard planı hazır)
- [ ] İletişim sayfası (placeholder mevcut)

### Aşama 5: Optimizasyon
- [ ] Performance optimization
- [ ] SEO meta tags
- [ ] Image optimization
- [ ] Mobile responsiveness test

### Aşama 6: Test ve Deployment
- [ ] Cross-browser testing
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Production build

## 📝 İçerik Yapısı

### Firma Bilgileri
- Kuruluş yılı
- Deneyim süresi
- Faaliyet alanları
- Firma değerleri
- Çalışma prinsipleri

### Proje Kategorileri
- Konut projeleri
- Villa ve müstakil evler
- Ticari yapılar
- Endüstriyel tesisler
- Tadilat ve renovasyon

### Görsel İçerik
- Proje görselleri ve fotoğrafları
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
- Modern, minimalist line icons
- Consistent style
- Inşaat sektörüne uygun

### Animasyonlar
- Smooth page transitions
- Hover effects
- Scroll-triggered animations
- Loading animations

## 🔧 Geliştirme Notları

### Klasör Yapısı
```
src/
├── components/
│   ├── common/
│   ├── layout/
│   └── sections/
├── pages/
├── hooks/
├── utils/
├── assets/
└── styles/
```

### Kodlama Standartları
- ESLint + Prettier
- Component naming conventions
- Consistent file structure
- Code comments (Türkçe)

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
- React Router DOM ile routing sistemi
- Framer Motion ile animasyonlar
- React Icons kütüphanesi
- Tsparticles ile parti̇kül efektleri

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

#### **Proje Verileri:**
- **Haznedar Park:** 16 daire, 6 kat, Güngören
- **Bağcılar Meydan Life:** 28 daire, 12 kat, Bağcılar  
- **Fatih Gülbahçe Konağı:** Tarihi restorasyon projesi

#### **Özel Sayfalar:**
- Kentsel Dönüşüm Danışmanlık Formu (7 adımlı wizard, email sistemi)
- Projeler sayfası (Akıllı filtre sistemi, tasarım bütünlüğü)
- Proje detay sayfaları için routing

### 🚧 **Devam Eden/Planlanan İşler:**

1. **İç Sayfa İçerikleri:** Hakkımızda, Hizmetler, Projeler, İletişim sayfalarının detaylandırılması
2. **Kentsel Dönüşüm Formu:** 7 adımlı wizard formunun implement edilmesi
3. **SEO Optimizasyonu:** Meta tags, sitemap, analytics
4. **Performance:** Image optimization, lazy loading
5. **Responsive Testing:** Tüm cihazlarda test edilmesi

### 💡 **Teknik Notlar:**
- Proje assets klasöründe 3 proje için toplam 80+ fotoğraf mevcut
- CSS dosyası 834 satır, modern utility classlar ile
- Component-based architecture kullanılıyor
- Modern ES6+ syntax ve hooks kullanılıyor

---

*Bu döküman, Azaklar İnşaat kurumsal web sitesinin geliştirilmesi için temel rehber niteliğindedir. Geliştirme sürecinde gerekli güncellemeler yapılacaktır.*
