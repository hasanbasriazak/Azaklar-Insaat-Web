import { motion } from 'framer-motion';
import { 
  HiCheckCircle, 
  HiLightBulb, 
  HiShieldCheck, 
  HiTrendingUp,
  HiHeart
} from 'react-icons/hi';

const About = () => {
  const values = [
    {
      icon: HiShieldCheck,
      title: 'Güvenilirlik',
      description: '40 yıllık deneyimimizle size en güvenilir hizmeti sunuyoruz. Her projede kalite ve güven önceliğimizdir.',
      color: '#10b981'
    },
    {
      icon: HiLightBulb,
      title: 'İnovasyon',
      description: 'Modern teknolojiler ve yenilikçi yaklaşımlarla her projeyi en verimli şekilde gerçekleştiriyoruz.',
      color: '#f59e0b'
    },
    {
      icon: HiHeart,
      title: 'Müşteri Memnuniyeti',
      description: 'Müşterilerimizin beklentilerini aşmak ve uzun süreli ilişkiler kurmak bizim için en önemli hedeftir.',
      color: '#ef4444'
    },
    {
      icon: HiTrendingUp,
      title: 'Sürekli Gelişim',
      description: 'Sektördeki gelişmeleri yakından takip ediyor ve kendimizi sürekli geliştiriyoruz.',
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
                Hakkımızda
              </h1>
                             <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                 40 yıllık deneyimimizle güçlü temeller ve güvenli gelecek inşa ediyoruz
               </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Firma Hikayesi */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Azaklar İnşaat Grubu
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Azaklar İnşaat Grubu, 40 yıllık tecrübesini genç ve dinamik kadrosunun enerjisiyle birleştirerek, yakın ve orta vadeli projeleriyle inşaat sektörüne yeni bir soluk kazandırmaktadır. Şehrin en seçkin lokasyonlarında, sakinlerinin yaşam kalitesini artırmayı hedefleyen projeler üreten firmamız, her detayın titizlikle düşünüldüğü tasarımlarıyla öne çıkmaktadır. Projelerimizde estetik ve fonksiyonelliği ön planda tutarken, ekonomik gerçekleri de göz ardı etmiyoruz.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kaliteli bir yaşamı ulaşılmaz bir hayal olmaktan çıkaran Azaklar İnşaat Grubu, her gün yeni rüyalar inşa etmeye devam etmektedir. Yenilikçi yaklaşım, karşılıklı güven, dürüstlük ve çalışkanlık ilkeleri doğrultusunda her zaman en iyiyi hedefleyen firmamız; sahip olduğu değerler ve hayata kazandırdığı projelerle, sektörde saygın bir konuma ve haklı bir itibara sahiptir.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Gelişen ve değişen dünya standartlarını yakından takip ederek analiz eden Azaklar İnşaat, bu bakış açısını 40 yıllık deneyimiyle harmanlayarak hizmet yelpazesini sürekli genişletmektedir. Hayata yalnızca yeni yaşam alanları kazandırmakla kalmayan firmamız, aynı zamanda bulunduğu çevreye ve sektöre katma değer üretmektedir.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Günümüz modern yaşamının tüm ihtiyaçlarına cevap veren, güvenilir ve yüksek kaliteli lüks konut projelerini tek çatı altında toplayan Azaklar İnşaat Grubu, yaşam standartlarınızı yükseltmeyi hedefleyen iddialı projelerine aynı heyecan ve kararlılıkla devam edecektir.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed italic">
                Heyecanımıza ve gururumuza ortak olan tüm paydaşlarımıza ve dostlarımıza teşekkür ederiz.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="İnşaat sahası"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Modern mimari"
                  className="rounded-lg shadow-lg mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="İnşaat ekipmanları"
                  className="rounded-lg shadow-lg -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Tamamlanan proje"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Değerlerimiz */}
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
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bizi farklı kılan ve her projede rehber aldığımız temel değerlerimiz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <value.icon 
                    className="w-8 h-8"
                    style={{ color: value.color }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative section-padding bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 overflow-hidden"
        style={{
          boxShadow: 'inset 0 10px 20px -10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-100/80 to-transparent"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/60"></div>
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-600 bg-clip-text text-transparent">
                Bizimle Çalışmaya Hazır mısınız?
              </h2>
                             <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                 40 yıllık deneyimimiz ve uzman kadromuzla hayalinizdeki projeyi birlikte gerçekleştirelim.
               </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/iletisim"
                  className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(to right, #1e3a8a, #1e40af)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #1e40af, #1d4ed8)'}
                  onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #1e3a8a, #1e40af)'}
                >
                  İletişime Geçin
                  <HiCheckCircle />
                </a>
                <a
                  href="/projeler"
                  className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  Projelerimizi İnceleyin
                  <HiTrendingUp />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About; 