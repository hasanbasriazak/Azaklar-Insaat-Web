# Azaklar İnşaat Deploy Dokümanı

## 🚀 **ÇALIŞAN VERSİYON** - API Konfigürasyonu

### **API Publish Yolu:**
```
AzaklarApi/bin/Release/net8.0/ → api-deploy/AzaklarApi-simple/
```

### **Çalışan web.config:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
    </handlers>
    <aspNetCore processPath="dotnet" arguments=".\AzaklarApi.dll" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
  </system.webServer>
</configuration>
```

### **Çalışan start.bat:**
```batch
@echo off
echo Starting Azaklar Insaat API...
dotnet AzaklarApi.dll
pause
```

### **API Endpoints:**
- `GET /api/project` - Tüm projeleri listele
- `GET /api/project/{slug}` - Slug ile proje detayı
- `POST /api/project/images/{imageId}/delete` - Resim silme (POST metodu)
- `DELETE /api/project/images/{imageId}` - Resim silme (DELETE metodu)
- `POST /api/project/images/{imageId}/set-featured` - Vitrin fotoğrafı ayarlama

### **ÖNEMLİ UYARI:**
⚠️ **Bu çalışan konfigürasyonu değiştirmeyin!** API'de `stdoutLogEnabled="true"` ve `location` tag'i olmamalı.

---

## 🎨 **Vitrin Fotoğrafı Sistemi**

### **Özellikler:**
- ✅ **Admin panel'de** vitrin fotoğrafı seçme
- ✅ **API'de** vitrin önceliği ile sıralama
- ✅ **Frontend'de** vitrin fotoğrafı gösterimi
- ✅ **Otomatik sıralama** (vitrin önce)

### **Admin Panel Kullanımı:**
1. **Proje düzenle** sayfasına git
2. **Resimlerin üzerine hover** et
3. **⭐ butonuna tıkla** → Vitrin yap
4. **"Vitrin" badge'i** görünür
5. **Mavi border** vitrin resimde

### **API Response:**
```json
{
  "images": [
    {
      "id": 7,
      "imageUrl": "/uploads/projects/resim.jpg",
      "isFeatured": true
    },
    {
      "id": 8,
      "imageUrl": "/uploads/projects/resim2.jpg", 
      "isFeatured": false
    }
  ]
}
```

---

## 📱 **Frontend Deploy**

### **Build Komutu:**
```bash
npm run build
```

### **Deploy Klasörü:**
```
dist/ → public/
```

### **Resim URL'leri:**
- **Development:** `http://localhost:5177/uploads/...`
- **Production:** `https://api.azaklaryapi.com/uploads/...`

### **Vitrin Fotoğrafı Gösterimi:**
- ✅ **Ana sayfa** projelerde vitrin resim gösterilir
- ✅ **Projeler sayfasında** vitrin resim gösterilir
- ✅ **Proje detay sayfasında** vitrin resim ilk sırada

---

## 🔧 **Admin Panel Deploy**

### **Build Komutu:**
```bash
cd AzaklarAdmin && npm run build
```

### **Deploy Klasörü:**
```
AzaklarAdmin/dist/ → admin-deploy/
```

### **Vitrin Fotoğrafı Özellikleri:**
- ✅ **Vitrin yapma butonu** (⭐)
- ✅ **Vitrin badge'i** (mavi)
- ✅ **Mavi border** vitrin resimler için
- ✅ **Otomatik sıralama** (vitrin önce)

---

## 📋 **Manuel Deploy Adımları**

### **1. API Deploy:**
```bash
cd AzaklarApi
dotnet publish -c Release -o ../api-deploy/AzaklarApi-simple
```

### **2. Frontend Deploy:**
```bash
npm run build
cp -r dist/* public/
```

### **3. Admin Panel Deploy:**
```bash
cd AzaklarAdmin
npm run build
cd ..
cp -r AzaklarAdmin/dist/* admin-deploy/
```

### **4. Sunucuya Upload:**
- **API:** `api-deploy/AzaklarApi-simple/` → Sunucu API klasörü
- **Frontend:** `public/` → Sunucu web klasörü
- **Admin:** `admin-deploy/` → Sunucu admin klasörü

---

## 🎯 **Son Kontroller**

### **API Test:**
```bash
curl https://api.azaklaryapi.com/api/project
```

### **Frontend Test:**
- Ana sayfa projeleri yükleniyor mu?
- Vitrin fotoğrafları gösteriliyor mu?
- Resim URL'leri doğru mu?

### **Admin Panel Test:**
- Proje düzenleme çalışıyor mu?
- Vitrin fotoğrafı seçme çalışıyor mu?
- Resim silme çalışıyor mu?

---

*Bu doküman, çalışan konfigürasyonları korumak için oluşturulmuştur.*
