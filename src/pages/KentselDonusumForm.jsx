import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiArrowRight, 
  HiCheck, 
  HiUser,
  HiLocationMarker,
  HiOfficeBuilding,
  HiUserGroup,
  HiClipboardList,
  HiDocumentAdd,
  HiCheckCircle
} from 'react-icons/hi';
import { sendContactEmail } from '../config/email';

const KentselDonusumForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
    referenceId: `KD${Date.now()}`
  });

  const steps = [
    { id: 1, title: 'Kişisel Bilgiler', icon: HiUser },
    { id: 2, title: 'Gayrimenkul Konumu', icon: HiLocationMarker },
    { id: 3, title: 'Yapı Durumu', icon: HiOfficeBuilding },
    { id: 4, title: 'Malik Bilgileri', icon: HiUserGroup },
    { id: 5, title: 'Dönüşüm Talebi', icon: HiClipboardList },
    { id: 6, title: 'Belgeler', icon: HiDocumentAdd },
    { id: 7, title: 'Onay', icon: HiCheckCircle }
  ];

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [`step${step}`]: { ...prev[`step${step}`], ...data }
    }));
    // Clear validation errors when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [`step${step}`]: {}
    }));
  };

  // Validasyon fonksiyonları
  const validateStep = (step) => {
    const errors = {};
    const stepData = formData[`step${step}`];

    switch (step) {
      case 1:
        if (!stepData.adSoyad?.trim()) {
          errors.adSoyad = 'Ad soyad zorunludur';
        }
        if (!stepData.telefon?.trim()) {
          errors.telefon = 'Telefon numarası zorunludur';
        } else if (!/^[0-9\s()+-]{10,}$/.test(stepData.telefon.replace(/\s/g, ''))) {
          errors.telefon = 'Geçerli bir telefon numarası giriniz';
        }
        if (!stepData.email?.trim()) {
          errors.email = 'E-posta adresi zorunludur';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepData.email)) {
          errors.email = 'Geçerli bir e-posta adresi giriniz';
        }
        break;

      case 2:
        if (!stepData.ilce?.trim()) {
          errors.ilce = 'İlçe bilgisi zorunludur';
        }
        break;

      case 3:
        if (!stepData.binaYasi) {
          errors.binaYasi = 'Bina yaşı zorunludur';
        } else if (stepData.binaYasi < 1 || stepData.binaYasi > 200) {
          errors.binaYasi = 'Geçerli bir bina yaşı giriniz (1-200 yıl)';
        }
        if (!stepData.katSayisi) {
          errors.katSayisi = 'Kat sayısı zorunludur';
        } else if (stepData.katSayisi < 1 || stepData.katSayisi > 50) {
          errors.katSayisi = 'Geçerli bir kat sayısı giriniz (1-50)';
        }
        if (!stepData.bagimsisBolum) {
          errors.bagimsisBolum = 'Bağımsız bölüm sayısı zorunludur';
        } else if (stepData.bagimsisBolum < 1 || stepData.bagimsisBolum > 500) {
          errors.bagimsisBolum = 'Geçerli bir bağımsız bölüm sayısı giriniz (1-500)';
        }
        break;

      case 4:
        if (!stepData.toplamMalik) {
          errors.toplamMalik = 'Toplam malik sayısı zorunludur';
        } else if (stepData.toplamMalik < 1 || stepData.toplamMalik > 1000) {
          errors.toplamMalik = 'Geçerli bir malik sayısı giriniz (1-1000)';
        }
        break;

      case 5:
        // Bu adımda zorunlu alan yok
        break;

      case 6:
        // Bu adım opsiyonel
        break;

      default:
        break;
    }

    return errors;
  };

  const nextStep = () => {
    // Mevcut adımı validasyondan geçir
    const errors = validateStep(currentStep);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        [`step${currentStep}`]: errors
      }));
      
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validasyon başarılı, sonraki adıma geç
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      setValidationErrors(prev => ({
        ...prev,
        [`step${currentStep}`]: {}
      }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      console.log('📤 Form gönderiliyor...', formData);
      
      // Dosyaları topla
      const files = {
        tapuGorseli: formData.step6?.tapuGorseli || [],
        binaFotograflari: formData.step6?.binaFotograflari || [],
        digerBelgeler: formData.step6?.digerBelgeler || []
      };

      // Backend API'sine mail gönderme isteği
      const result = await sendContactEmail(formData, files);
      
      console.log('✅ Mail başarıyla gönderildi:', result);
      
      setIsCompleted(true);
    } catch (error) {
      console.error('❌ Form gönderimi hatası:', error);
      
      // Kullanıcıya hata mesajı göster
      alert(`Mail gönderilemedi: ${error.message || 'Bilinmeyen hata'}\n\nLütfen daha sonra tekrar deneyin veya doğrudan iletişime geçin.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const stepErrors = validationErrors[`step${currentStep}`] || {};
    
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData.step1} updateData={(data) => updateFormData(1, data)} errors={stepErrors} />;
      case 2:
        return <Step2 formData={formData.step2} updateData={(data) => updateFormData(2, data)} errors={stepErrors} />;
      case 3:
        return <Step3 formData={formData.step3} updateData={(data) => updateFormData(3, data)} errors={stepErrors} />;
      case 4:
        return <Step4 formData={formData.step4} updateData={(data) => updateFormData(4, data)} errors={stepErrors} />;
      case 5:
        return <Step5 formData={formData.step5} updateData={(data) => updateFormData(5, data)} />;
      case 6:
        return <Step6 updateData={(data) => updateFormData(6, data)} />;
      case 7:
        return <Step7 formData={formData} onSubmit={submitForm} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  if (isCompleted) {
    return <CompletionScreen referenceId={formData.referenceId} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-72 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden"
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
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  <span>Ana Sayfaya Dön</span>
                </button>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="px-4 py-1 bg-orange-500/20 text-orange-200 rounded-full text-sm font-medium border border-orange-400/30">
                  Adım {currentStep} / {steps.length}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Kentsel Dönüşüm Danışmanlığı
              </h1>
              
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Ücretsiz danışmanlık almak için formu doldurun, uzman ekibimiz sizinle iletişime geçsin.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white relative z-20 pb-16"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
      >

        {/* Progress Steps */}
        <div className="border-b">
          <div className="container-custom py-8">
            <div className="flex items-center justify-between pt-8 pb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${currentStep === step.id 
                      ? 'bg-orange-500 text-white' 
                      : currentStep > step.id 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <HiCheck className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 px-12 py-16"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 7 && (
              <div className="flex justify-between mt-16">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`
                    flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-all
                    ${currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <HiArrowLeft />
                  Önceki
                </button>

                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Sonraki
                  <HiArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Step Components
const Step1 = ({ formData, updateData, errors }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Kişisel Bilgiler</h2>
    {Object.keys(errors).length > 0 && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <h3 className="text-red-800 font-medium">Lütfen aşağıdaki alanları kontrol edin:</h3>
        </div>
        <ul className="text-sm text-red-700 space-y-1">
          {Object.values(errors).map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ad Soyad *
        </label>
        <input
          type="text"
          value={formData.adSoyad || ''}
          onChange={(e) => updateData({ adSoyad: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.adSoyad ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Adınız ve soyadınız"
        />
        {errors.adSoyad && (
          <p className="mt-2 text-sm text-red-600">{errors.adSoyad}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Telefon Numarası *
        </label>
        <input
          type="tel"
          value={formData.telefon || ''}
          onChange={(e) => updateData({ telefon: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.telefon ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="0555 123 45 67"
        />
        {errors.telefon && (
          <p className="mt-2 text-sm text-red-600">{errors.telefon}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          E-posta Adresi *
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateData({ email: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="ornek@email.com"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          İletişim Tercihi
        </label>
        <div className="space-y-3">
          {['Telefon', 'WhatsApp', 'E-posta'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input
                type="radio"
                name="iletisimTercihi"
                value={option}
                checked={formData.iletisimTercihi === option}
                onChange={(e) => updateData({ iletisimTercihi: e.target.value })}
                className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, updateData, errors }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Gayrimenkulün Konumu</h2>
    {Object.keys(errors).length > 0 && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <h3 className="text-red-800 font-medium">Lütfen aşağıdaki alanları kontrol edin:</h3>
        </div>
        <ul className="text-sm text-red-700 space-y-1">
          {Object.values(errors).map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">İl *</label>
        <input
          type="text"
          value="İstanbul"
          readOnly
          className="w-full px-4 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
          placeholder="İstanbul"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">İlçe *</label>
        <input
          type="text"
          value={formData.ilce || ''}
          onChange={(e) => updateData({ ilce: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.ilce ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="İlçe adı"
        />
        {errors.ilce && (
          <p className="mt-2 text-sm text-red-600">{errors.ilce}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Mahalle</label>
        <input
          type="text"
          value={formData.mahalle || ''}
          onChange={(e) => updateData({ mahalle: e.target.value })}
          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all"
          placeholder="Mahalle adı"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tapu Bilgisi Var mı?
        </label>
        <div className="space-y-3">
          {['Evet', 'Hayır'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input
                type="radio"
                name="tapuBilgisi"
                value={option}
                checked={formData.tapuBilgisi === option}
                onChange={(e) => updateData({ tapuBilgisi: e.target.value })}
                className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">Açık Adres</label>
        <textarea
          value={formData.acikAdres || ''}
          onChange={(e) => updateData({ acikAdres: e.target.value })}
          rows={4}
          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all resize-none"
          placeholder="Detaylı adres bilgisi"
        />
      </div>
    </div>
  </div>
);

const Step3 = ({ formData, updateData, errors }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Mevcut Yapının Durumu</h2>
    {Object.keys(errors).length > 0 && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <h3 className="text-red-800 font-medium">Lütfen aşağıdaki alanları kontrol edin:</h3>
        </div>
        <ul className="text-sm text-red-700 space-y-1">
          {Object.values(errors).map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bina Kaç Yıllık? *
        </label>
        <input
          type="number"
          value={formData.binaYasi || ''}
          onChange={(e) => updateData({ binaYasi: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.binaYasi ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Yıl olarak"
        />
        {errors.binaYasi && (
          <p className="mt-2 text-sm text-red-600">{errors.binaYasi}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Toplam Kat Sayısı *
        </label>
        <input
          type="number"
          value={formData.katSayisi || ''}
          onChange={(e) => updateData({ katSayisi: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.katSayisi ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Kat sayısı"
        />
        {errors.katSayisi && (
          <p className="mt-2 text-sm text-red-600">{errors.katSayisi}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bağımsız Bölüm Sayısı *
        </label>
        <input
          type="number"
          value={formData.bagimsisBolum || ''}
          onChange={(e) => updateData({ bagimsisBolum: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.bagimsisBolum ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Daire + Dükkan sayısı"
        />
        {errors.bagimsisBolum && (
          <p className="mt-2 text-sm text-red-600">{errors.bagimsisBolum}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Binanın Durumu
        </label>
        <div className="space-y-3">
          {['Çok eski', 'Orta yaşlı', 'Sağlam ama dönüşüm düşünülüyor'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input
                type="radio"
                name="binaDurumu"
                value={option}
                checked={formData.binaDurumu === option}
                onChange={(e) => updateData({ binaDurumu: e.target.value })}
                className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Daha önce riskli yapı başvurusu yapıldı mı?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Evet', 'Hayır', 'Bilmiyorum'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input
                type="radio"
                name="riskliYapi"
                value={option}
                checked={formData.riskliYapi === option}
                onChange={(e) => updateData({ riskliYapi: e.target.value })}
                className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Step4 = ({ formData, updateData, errors }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Malik Bilgileri</h2>
    {Object.keys(errors).length > 0 && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <h3 className="text-red-800 font-medium">Lütfen aşağıdaki alanları kontrol edin:</h3>
        </div>
        <ul className="text-sm text-red-700 space-y-1">
          {Object.values(errors).map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Toplam Malik Sayısı *
        </label>
        <input
          type="number"
          value={formData.toplamMalik || ''}
          onChange={(e) => updateData({ toplamMalik: e.target.value })}
          className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
            errors.toplamMalik ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Malik sayısı"
        />
        {errors.toplamMalik && (
          <p className="mt-2 text-sm text-red-600">{errors.toplamMalik}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Kaç Malik ile Aktif İletişim Var?
        </label>
        <input
          type="number"
          value={formData.aktifMalik || ''}
          onChange={(e) => updateData({ aktifMalik: e.target.value })}
          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all"
          placeholder="İletişimde olan malik sayısı"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Maliklerin Dönüşüme Bakışı
        </label>
        <div className="space-y-3">
          {['Olumlu', 'Kararsız', 'Bilgilenmek istiyorlar'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input
                type="radio"
                name="malikBakis"
                value={option}
                checked={formData.malikBakis === option}
                onChange={(e) => updateData({ malikBakis: e.target.value })}
                className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4"
              />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tapu Türü
        </label>
        <select
          value={formData.tapuTuru || ''}
          onChange={(e) => updateData({ tapuTuru: e.target.value })}
          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[length:12px_8px] bg-[position:calc(100%_-_16px)_center] cursor-pointer"
        >
          <option value="">Seçin</option>
          <option value="Kat irtifakı">Kat irtifakı</option>
          <option value="Kat mülkiyeti">Kat mülkiyeti</option>
          <option value="Arsa tapusu">Arsa tapusu</option>
          <option value="Bilmiyorum">Bilmiyorum</option>
        </select>
      </div>
    </div>
  </div>
);

const Step5 = ({ formData, updateData }) => {
  const donusumTurleri = [
    'Yıkıp yeniden yapma',
    'Güçlendirme',
    'Kentsel dönüşüm projesi',
    'TOKİ dönüşümü'
  ];

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateData({ [field]: newValues });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Dönüşüm Talebi ve Hedefi</h2>
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Düşünülen Dönüşüm Türü (Birden fazla seçilebilir)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {donusumTurleri.map((tur) => (
              <label key={tur} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={(formData.donusumTuru || []).includes(tur)}
                  onChange={() => handleCheckboxChange('donusumTuru', tur)}
                  className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4 rounded"
                />
                <span className="text-gray-700 font-medium">{tur}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Başlamak İstenen Süre
          </label>
          <div className="space-y-3">
            {['1-3 ay içinde', '3-6 ay içinde', 'Sadece bilgi almak istiyorum'].map((option) => (
              <label key={option} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="baslamaSure"
                  value={option}
                  checked={formData.baslamaSure === option}
                  onChange={(e) => updateData({ baslamaSure: e.target.value })}
                  className="mr-3 text-orange-500 focus:ring-orange-500 w-4 h-4"
                />
                <span className="text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Step6 = ({ updateData }) => {
  const [fileStatus, setFileStatus] = useState({
    tapuGorseli: { files: [], totalSize: 0, error: null },
    binaFotograflari: { files: [], totalSize: 0, error: null },
    digerBelgeler: { files: [], totalSize: 0, error: null },
    toplamBoyut: 0
  });

  // Dosya boyutu limitleri (bytes)
  const limits = {
    tapuGorseli: 2 * 1024 * 1024, // 2MB
    binaFotograflari: 8 * 1024 * 1024, // 8MB  
    digerBelgeler: 5 * 1024 * 1024, // 5MB
    toplam: 15 * 1024 * 1024 // 15MB toplam
  };

  // Dosya boyutunu human readable format'a çevir
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Dosya validasyonu
  const validateFiles = (files, type) => {
    const fileArray = Array.from(files);
    let totalSize = 0;
    let errors = [];

    // İzin verilen dosya tipleri
    const allowedTypes = {
      tapuGorseli: ['image/jpeg', 'image/jpg', 'image/png'],
      binaFotograflari: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      digerBelgeler: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    };

    fileArray.forEach(file => {
      totalSize += file.size;
      
      // Dosya tipi kontrolü
      if (!allowedTypes[type].includes(file.type)) {
        errors.push(`${file.name}: Desteklenmeyen dosya formatı`);
      }
      
      // Tek dosya boyut kontrolü (10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: Dosya çok büyük (max 10MB)`);
      }
    });

    // Kategori boyut kontrolü
    if (totalSize > limits[type]) {
      errors.push(`${type} toplam boyutu ${formatFileSize(limits[type])} sınırını aşıyor`);
    }

    // Tapu için tek dosya kontrolü
    if (type === 'tapuGorseli' && fileArray.length > 1) {
      errors.push('Tapu görseli için sadece 1 dosya seçebilirsiniz');
    }

    return { files: fileArray, totalSize, errors };
  };

  // Dosya seçimi handler
  const handleFileSelect = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validation = validateFiles(files, type);
    
    // Toplam boyut kontrolü
    const otherSizes = Object.keys(fileStatus)
      .filter(key => key !== type && key !== 'toplamBoyut')
      .reduce((sum, key) => sum + fileStatus[key].totalSize, 0);
    
    const newTotalSize = otherSizes + validation.totalSize;
    
    if (newTotalSize > limits.toplam) {
      validation.errors.push(`Toplam dosya boyutu ${formatFileSize(limits.toplam)} sınırını aşıyor`);
    }

    // State güncelleme
    const newFileStatus = {
      ...fileStatus,
      [type]: {
        files: validation.errors.length === 0 ? validation.files : [],
        totalSize: validation.errors.length === 0 ? validation.totalSize : 0,
        error: validation.errors.length > 0 ? validation.errors.join(', ') : null
      },
      toplamBoyut: validation.errors.length === 0 ? newTotalSize : fileStatus.toplamBoyut
    };

    setFileStatus(newFileStatus);

    // Form data güncelleme
    if (validation.errors.length === 0) {
      updateData({ [type]: validation.files });
    }
  };

  // Dosya silme
  const removeFile = (type, index) => {
    const newFiles = fileStatus[type].files.filter((_, i) => i !== index);
    const newTotalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
    
    const newFileStatus = {
      ...fileStatus,
      [type]: {
        files: newFiles,
        totalSize: newTotalSize,
        error: null
      },
      toplamBoyut: fileStatus.toplamBoyut - (fileStatus[type].files[index]?.size || 0)
    };

    setFileStatus(newFileStatus);
    updateData({ [type]: newFiles });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Belgeler ve Görseller</h2>
      
      {/* Genel Bilgi */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 font-medium mb-2">📎 Dosya Yükleme Bilgileri</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Toplam dosya boyutu: <strong>{formatFileSize(fileStatus.toplamBoyut)} / {formatFileSize(limits.toplam)}</strong></li>
          <li>• Tapu görseli: Tek dosya, max 2MB (JPG, PNG)</li>
          <li>• Bina fotoğrafları: Çoklu dosya, max 8MB (JPG, PNG, WEBP)</li>
          <li>• Diğer belgeler: Çoklu dosya, max 5MB (PDF, DOCX, XLSX)</li>
        </ul>
      </div>

      <div className="space-y-8">
        {/* Tapu Görseli */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tapu Görseli <span className="text-gray-500">(Opsiyonel - Tek dosya, max 2MB)</span>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect(e, 'tapuGorseli')}
            className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 ${
              fileStatus.tapuGorseli.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {fileStatus.tapuGorseli.error && (
            <p className="mt-2 text-sm text-red-600">{fileStatus.tapuGorseli.error}</p>
          )}
          
          {/* Seçili dosyalar */}
          {fileStatus.tapuGorseli.files.length > 0 && (
            <div className="mt-3 space-y-2">
              {fileStatus.tapuGorseli.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📄</span>
                    <span className="text-sm font-medium text-green-800">{file.name}</span>
                    <span className="text-xs text-green-600">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={() => removeFile('tapuGorseli', index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bina Fotoğrafları */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bina Fotoğrafları <span className="text-gray-500">(Opsiyonel - Çoklu dosya, max 8MB)</span>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={(e) => handleFileSelect(e, 'binaFotograflari')}
            className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 ${
              fileStatus.binaFotograflari.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {fileStatus.binaFotograflari.error && (
            <p className="mt-2 text-sm text-red-600">{fileStatus.binaFotograflari.error}</p>
          )}
          
          {/* Seçili dosyalar */}
          {fileStatus.binaFotograflari.files.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600">
                {fileStatus.binaFotograflari.files.length} dosya seçildi 
                ({formatFileSize(fileStatus.binaFotograflari.totalSize)})
              </p>
              {fileStatus.binaFotograflari.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🖼️</span>
                    <span className="text-sm font-medium text-green-800">{file.name}</span>
                    <span className="text-xs text-green-600">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={() => removeFile('binaFotograflari', index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diğer Belgeler */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Diğer Belgeler <span className="text-gray-500">(Opsiyonel - Çoklu dosya, max 5MB)</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            multiple
            onChange={(e) => handleFileSelect(e, 'digerBelgeler')}
            className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 ${
              fileStatus.digerBelgeler.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          <p className="text-sm text-gray-500 mt-2">
            PDF, Word (DOCX), Excel (XLSX) dosyaları yükleyebilirsiniz.
          </p>
          {fileStatus.digerBelgeler.error && (
            <p className="mt-2 text-sm text-red-600">{fileStatus.digerBelgeler.error}</p>
          )}
          
          {/* Seçili dosyalar */}
          {fileStatus.digerBelgeler.files.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600">
                {fileStatus.digerBelgeler.files.length} dosya seçildi 
                ({formatFileSize(fileStatus.digerBelgeler.totalSize)})
              </p>
              {fileStatus.digerBelgeler.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">
                      {file.type.includes('pdf') ? '📕' : file.type.includes('word') ? '📘' : '📗'}
                    </span>
                    <span className="text-sm font-medium text-green-800">{file.name}</span>
                    <span className="text-xs text-green-600">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={() => removeFile('digerBelgeler', index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Step7 = ({ formData, onSubmit, isSubmitting }) => {
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showKvkkError, setShowKvkkError] = useState(false);

  const handleSubmit = () => {
    if (!kvkkAccepted) {
      setShowKvkkError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setShowKvkkError(false);
    onSubmit();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Onay ve Gönderim</h2>
      
      {showKvkkError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <h3 className="text-red-800 font-medium">KVKK onayı zorunludur</h3>
          </div>
        </div>
      )}
      
      <div className="space-y-8">
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Başvuru Özeti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-600">Ad Soyad:</span> 
              <div className="text-gray-900 font-medium">{formData.step1.adSoyad || '-'}</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-600">Telefon:</span> 
              <div className="text-gray-900 font-medium">{formData.step1.telefon || '-'}</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-600">Konum:</span> 
              <div className="text-gray-900 font-medium">İstanbul / {formData.step2.ilce || '-'}</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-600">Bina Yaşı:</span> 
              <div className="text-gray-900 font-medium">{formData.step3.binaYasi || '-'} yıl</div>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-orange-500 bg-orange-50 p-6 rounded-r-xl">
          <p className="text-sm text-orange-800 font-medium">
            <strong>Referans ID:</strong> {formData.referenceId}
          </p>
          <p className="text-sm text-orange-700 mt-2">
            Bu referans numarasını not alın, başvurunuzu takip edebilirsiniz.
          </p>
        </div>

        <div className="space-y-4">
          <label className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all ${
            showKvkkError && !kvkkAccepted ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}>
            <input
              type="checkbox"
              checked={kvkkAccepted}
              onChange={(e) => {
                setKvkkAccepted(e.target.checked);
                if (e.target.checked) setShowKvkkError(false);
              }}
              className="mt-1 text-orange-500 focus:ring-orange-500 w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">
              Kişisel verilerimin işlenmesine ilişkin 
              <a href="#" className="text-orange-600 hover:underline font-medium"> KVKK Aydınlatma Metni</a>'ni 
              okudum ve kabul ediyorum. *
            </span>
          </label>

          <label className="flex items-start gap-4 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
            <input
              type="checkbox"
              className="mt-1 text-orange-500 focus:ring-orange-500 w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">
              Azaklar İnşaat'tan kampanya ve bilgilendirme e-postaları almak istiyorum.
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-5 px-6 rounded-xl font-medium text-white transition-all text-lg ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
        </button>
      </div>
    </div>
  );
};

const CompletionScreen = ({ referenceId }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <HiCheck className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Başvurunuz Başarıyla Alındı!
      </h2>
      
      <p className="text-gray-600 mb-4">
        Kentsel dönüşüm danışmanlık başvurunuz başarıyla gönderildi. 
        <strong className="text-orange-600">Uzmanlarımız en geç 24 saat içinde</strong> sizinle iletişime geçecektir.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600">📧</span>
          <span className="text-blue-800 font-medium">E-posta Onayı Gönderildi</span>
        </div>
        <p className="text-sm text-blue-700">
          E-posta adresinize detaylı bilgi ve referans numarası gönderilmiştir.
        </p>
      </div>
      
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
        <p className="text-sm text-orange-800 font-medium mb-2">
          📋 Başvuru Referans Numaranız
        </p>
        <p className="text-lg font-bold text-orange-900 tracking-wider">
          {referenceId}
        </p>
        <p className="text-xs text-orange-700 mt-1">
          Bu numarayı kaydedin, iletişimde kullanılacaktır.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => window.location.href = '/'}
          className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Ana Sayfaya Dön
        </button>
        
        <button
          onClick={() => window.location.href = '/projeler'}
          className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Projelerimizi İnceleyin
        </button>
      </div>
    </div>
  </div>
);

export default KentselDonusumForm; 