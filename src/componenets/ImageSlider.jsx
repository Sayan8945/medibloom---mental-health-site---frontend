import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import homeImg1 from '../assets/homeimg1.png';
import homeImg2 from '../assets/homeimg2.png';
import homeImg3 from '../assets/homeimg3.png';
import homeImg4 from '../assets/homeimg4.png';
import homeImg5 from '../assets/homeimg5.png';

const IMAGES = [homeImg3, homeImg2, homeImg5, homeImg1, homeImg4];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[540px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          alt={`Mental wellness slide ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === currentIndex
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
