import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import KentselDonusumForm from './pages/KentselDonusumForm';
import Contact from './pages/Contact';

// SEO Helper function
function updateSEO(title, description, keywords) {
  // Update title
  document.title = title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords);
  }
  
  // Update Open Graph meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description);
  }
  
  // Update Twitter meta tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', title);
  }
  
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', description);
  }
}

// Scroll to top and SEO component
function ScrollToTopAndSEO() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // SEO updates based on route
    const pageInfo = {
      '/': {
        title: 'Azaklar İnşaat - İstanbul\'da 40 Yıllık Deneyim | Kentsel Dönüşüm Uzmanı',
        description: 'Azaklar İnşaat 40 yıllık deneyimi ile İstanbul\'da konut projeleri, kentsel dönüşüm, tadilat ve renovasyon hizmetleri sunmaktadır. Güvenilir inşaat çözümleri için bizi arayın.',
        keywords: 'azaklar inşaat, istanbul inşaat, kentsel dönüşüm, konut projeleri, tadilat renovasyon, inşaat firması istanbul'
      },
      '/hakkimizda': {
        title: 'Hakkımızda - Azaklar İnşaat | 40 Yıllık Tecrübe',
        description: 'Azaklar İnşaat\'ın 40 yıllık hikayesi, vizyonu ve değerleri. İstanbul\'da güvenilir inşaat çözümleri sunan deneyimli ekibimizle tanışın.',
        keywords: 'azaklar inşaat hakkında, inşaat firması geçmişi, istanbul inşaat deneyimi, azaklar yapı hikayesi'
      },
      '/projeler': {
        title: 'Projelerimiz - Azaklar İnşaat | Tamamlanan ve Devam Eden Projeler',
        description: 'Azaklar İnşaat\'ın tamamlanan ve devam eden projeleri. Haznedar Park, Bağcılar Meydan Life ve diğer kaliteli inşaat projelerimizi keşfedin.',
        keywords: 'azaklar projeler, haznedar park, bağcılar meydan life, fatih gülbahçe konağı, istanbul konut projeleri'
      },
      '/kentsel-donusum-danismanligi': {
        title: 'Kentsel Dönüşüm Danışmanlığı - Azaklar İnşaat | Ücretsiz Değerlendirme',
        description: 'Kentsel dönüşüm sürecinizde uzman ekibimizden ücretsiz danışmanlık alın. 40 yıllık deneyimimizle güvenli ve karlı dönüşüm süreçleri.',
        keywords: 'kentsel dönüşüm danışmanlık, istanbul kentsel dönüşüm, ücretsiz değerlendirme, azaklar kentsel dönüşüm'
      },
      '/iletisim': {
        title: 'İletişim - Azaklar İnşaat | Güngören, İstanbul',
        description: 'Azaklar İnşaat ile iletişime geçin. Güngören Haznedar\'daki merkez ofisimiz, telefon, e-posta bilgileri ve iletişim formu.',
        keywords: 'azaklar iletişim, güngören inşaat, haznedar inşaat, istanbul inşaat iletişim, azaklar telefon'
      }
    };

    const currentPageInfo = pageInfo[pathname] || pageInfo['/'];
    updateSEO(currentPageInfo.title, currentPageInfo.description, currentPageInfo.keywords);

    // Scroll functionality
    if (hash) {
      // Hash varsa o section'a scroll yap
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    } else {
      // Hash yoksa sayfa başına çık
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTopAndSEO />
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/projeler" element={<Projects />} />
            <Route path="/proje/:projectId" element={<ProjectDetail />} />
            <Route path="/kentsel-donusum-danismanligi" element={<KentselDonusumForm />} />
            <Route path="/iletisim" element={<Contact />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
