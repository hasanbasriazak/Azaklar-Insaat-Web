import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiOfficeBuilding,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { API_ENDPOINTS, apiCall } from '../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await apiCall(API_ENDPOINTS.CONTACT_EMAIL, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        console.error('Contact form error:', result.error);
      }
    } catch (error) {
      console.error('İletişim formu gönderim hatası:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: HiOfficeBuilding,
      title: 'Firma',
      content: 'AZAKLAR YAPI SANAYİ TİC. LTD. ŞTİ',
      color: '#1e3a8a'
    },
    {
      icon: HiLocationMarker,
      title: 'Adres',
      content: 'Şevketdağ Cd. No:18/A Güngören / Haznedar / İSTANBUL',
      color: '#f97316'
    },
    {
      icon: HiPhone,
      title: 'Telefon',
      content: '(212) 555 03-96',
      color: '#10b981'
    },
    {
      icon: HiMail,
      title: 'E-Posta',
      content: 'info@azaklaryapi.com',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 overflow-hidden"
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
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                İletişim
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                Proje danışmanlığı ve sorularınız için bizimle iletişime geçin
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* İletişim Bilgileri */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              İletişim Bilgilerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Merkez ofisimizden bizlere ulaşabilirsiniz.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${info.color}15` }}
                >
                  <info.icon 
                    className="w-8 h-8"
                    style={{ color: info.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {info.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* İletişim Formu ve Harita */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* İletişim Formu */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Bize Mesaj Gönderin
              </h3>
              <p className="text-gray-600 mb-8">
                Proje danışmanlığı, fiyat teklifi veya herhangi bir sorunuz için formu doldurun. 
                En kısa sürede size dönüş yapacağız.
              </p>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
                >
                  <HiCheckCircle className="text-green-500 text-xl" />
                  <span className="text-green-700">
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                  </span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
                >
                  <HiExclamationCircle className="text-red-500 text-xl" />
                  <span className="text-red-700">
                    Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: '#1e3a8a' }}
                      onFocus={(e) => e.target.style.ringColor = '#1e3a8a'}
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: '#1e3a8a' }}
                      onFocus={(e) => e.target.style.ringColor = '#1e3a8a'}
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: '#1e3a8a' }}
                      onFocus={(e) => e.target.style.ringColor = '#1e3a8a'}
                      placeholder="(5xx) xxx xx xx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konu *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px',
                        focusRingColor: '#1e3a8a'
                      }}
                      onFocus={(e) => e.target.style.ringColor = '#1e3a8a'}
                    >
                      <option value="">Konu seçin</option>
                      <option value="Proje Danışmanlığı">Proje Danışmanlığı</option>
                      <option value="Fiyat Teklifi">Fiyat Teklifi</option>
                      <option value="Kentsel Dönüşüm">Kentsel Dönüşüm</option>
                      <option value="Genel Bilgi">Genel Bilgi</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                    style={{ focusRingColor: '#1e3a8a' }}
                    onFocus={(e) => e.target.style.ringColor = '#1e3a8a'}
                    placeholder="Mesajınızı buraya yazın..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    background: isSubmitting ? '#6b7280' : 'linear-gradient(to right, #1e3a8a, #1e40af)'
                  }}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            </motion.div>

            {/* Harita */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Ofis Konumumuz
              </h3>
              <p className="text-gray-600 mb-8">
                Güngören merkez ofisimize kolayca ulaşabilirsiniz. 
                Randevu almak için lütfen önceden arayınız.
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6021.518166246755!2d28.872896999999995!3d41.008646!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb3992e941ab%3A0x805b0d044703d19e!2zSGF6bmVkYXIsIMWeZXZrZXQgRGHEnyBDZC4gTm86MTgsIDM0MTYwIEfDvG5nw7ZyZW4vxLBzdGFuYnVsLCBUw7xya2l5ZQ!5e0!3m2!1str!2sus!4v1752657501159!5m2!1str!2sus"
                  className="w-full h-96"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Azaklar Yapı Ofis Konumu"
                ></iframe>
              </div>

              {/* Ek Bilgiler */}
              <div className="mt-8 bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Çalışma Saatleri
                </h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Pazartesi - Cuma:</span>
                    <span className="font-medium">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumartesi:</span>
                    <span className="font-medium">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar:</span>
                    <span className="font-medium text-red-500">Kapalı</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 