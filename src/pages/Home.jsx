import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import ProcessSteps from '../components/sections/ProcessSteps';
import CompanyValues from '../components/sections/CompanyValues';

const Home = () => {
  // Mouse tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);


  // Mouse tracking effect for 3D tilt
  useEffect(() => {
    let timeoutId;
    
    const handleMouseMove = (e) => {
      const rect = window.innerWidth;
      const height = window.innerHeight;
      
      // Normalize mouse position to -1 to 1 range
      setMousePos({
        x: ((e.clientX - rect / 2) / rect) * 2,
        y: ((e.clientY - height / 2) / height) * 2
      });
      setIsMouseMoving(true);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsMouseMoving(false), 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);



  return (
    <div>
              {/* Minimalist Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: `
              linear-gradient(
                rgba(0, 0, 0, 0.4), 
                rgba(0, 0, 0, 0.5)
              ),
              url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundAttachment: 'fixed'
          }}
                >






        {/* 3D Tilt Hero Title with Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: 'relative',
            zIndex: 20,
            textAlign: 'center',
            padding: '0 20px',
            perspective: '1000px'
          }}
        >
          <motion.div
            animate={{
              rotateX: mousePos.y * 12,
              rotateY: mousePos.x * 12,
              scale: isMouseMoving ? 1.05 : 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              mass: 0.05 
            }}
            style={{
              position: 'relative',
              display: 'inline-block',
              background: 'transparent',
              borderRadius: '0px',
              border: '7px solid #ffffff',
              padding: 'clamp(60px, 8vw, 120px) clamp(60px, 8vw, 120px)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, ${0.3 + Math.abs(mousePos.x) * 0.1 + Math.abs(mousePos.y) * 0.1}),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                0 0 60px rgba(249, 115, 22, ${0.2 + isMouseMoving * 0.1})
              `,
              transformStyle: 'preserve-3d',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            {/* Frame decorations */}
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: `
                  linear-gradient(
                    45deg,
                    rgba(249, 115, 22, 0.3) 0%,
                    transparent 25%,
                    transparent 75%,
                    rgba(249, 115, 22, 0.3) 100%
                  )
                `,
                borderRadius: '0px',
                zIndex: -1,
                filter: 'blur(2px)'
              }}
            />
            
            {/* Corner accents */}
            {[
              { top: '10px', left: '10px' },
              { top: '10px', right: '10px' },
              { bottom: '10px', left: '10px' },
              { bottom: '10px', right: '10px' }
            ].map((position, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  ...position,
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(249, 115, 22, 0.6)',
                  borderRadius: '0px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  transform: `translateZ(${10 + index * 2}px)`,
                  opacity: isMouseMoving ? 1 : 0.7,
                  transition: 'opacity 0.3s ease'
                }}
              />
            ))}

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: '600',
                lineHeight: '1.2',
                margin: 0,
                color: '#ffffff',
                textShadow: `
                  0 4px 20px rgba(0, 0, 0, 0.7),
                  0 0 40px rgba(255, 255, 255, ${0.3 + isMouseMoving * 0.2})
                `,
                letterSpacing: '-0.02em',
                transform: 'translateZ(20px)',
                position: 'relative'
              }}
            >
              Güçlü Temellerle
              <br />
              <span 
                style={{ 
                  color: '#f97316',
                  textShadow: `
                    0 4px 20px rgba(0, 0, 0, 0.7),
                    0 0 30px rgba(249, 115, 22, ${0.5 + isMouseMoving * 0.3})
                  `
                }}
              >
                Güvenli Gelecek
              </span>
            </h1>
          </motion.div>
        </motion.div>


      </motion.div>

      {/* Diğer Bileşenler */}
      <Services />
      <ProcessSteps />
      <FeaturedProjects />
      <CompanyValues />
    </div>
  );
};

export default Home; 