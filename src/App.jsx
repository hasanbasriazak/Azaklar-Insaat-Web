import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import KentselDonusumForm from './pages/KentselDonusumForm';
import Contact from './pages/Contact';

// Scroll to top component
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
      <ScrollToTop />
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
