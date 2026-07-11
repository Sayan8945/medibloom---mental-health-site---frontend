import { motion, AnimatePresence } from 'framer-motion';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { useTheme } from '../contexts/ThemeContext';

// Sun/moon toggle — used on survey & analytics pages
// `showLabel` renders a readable "Light mode" / "Dark mode" text next to the icon
const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative flex items-center justify-center gap-2 rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${
        showLabel ? 'px-3 py-2' : 'w-9 h-9'
      } ${
        isDark
          ? 'bg-white/5 border-white/15 text-amber-300 hover:bg-white/10'
          : 'bg-white border-gray-200 text-gray-500 hover:text-primary hover:border-primary/40'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center flex-shrink-0"
        >
          {isDark ? <IoMoon className="w-4.5 h-4.5" /> : <IoSunny className="w-4.5 h-4.5" />}
        </motion.span>
      </AnimatePresence>
      {showLabel && (
        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
          {isDark ? 'Dark mode' : 'Light mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
