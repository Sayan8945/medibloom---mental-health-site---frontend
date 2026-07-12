import { useState, useEffect, useRef } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import toast from 'react-hot-toast';
import './Navbar.css';

const NAV_LINKS = [
  { id: 'home',        label: 'Home' },
  { id: 'services',   label: 'Services' },
  { id: 'resources',  label: 'Resources' },
  { id: 'about',      label: 'About' },
  { id: 'survey',     label: 'Assessment' },
  { id: 'testimonial',label: 'Inspiration' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isOpen,       setIsOpen]       = useState(false);
  const [activeSection,setActiveSection]= useState('home');
  const [scrolled,     setScrolled]     = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin,    setShowLogin]    = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Clear the active-link highlight when we leave the homepage
  useEffect(() => {
    if (!isHome) setActiveSection('');
  }, [isHome]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (!isHome) return;
      const scrollPosition = window.scrollY + 100;
      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition <= offsetTop + offsetHeight) {
            setActiveSection(id);
          }
        }
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  // Nav links point to homepage sections. When we're already on the homepage
  // this just scrolls; from any other page (survey, analytics, history) it
  // navigates back to "/" first and scrolls once the page has mounted.
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    if (isHome) {
      scrollTo(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    toast.success('You have been logged out successfully.', {
      icon: '👋',
      style: { borderRadius: '12px', background: '#0e1122', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-heroBg/90 backdrop-blur-md shadow-lg shadow-black/20 py-3'
            : 'bg-heroBg py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="MediBloom home"
          >
            <img src="/logo.png" alt="MediBloom logo" className="h-10 w-auto" />
            <span className="font-apple text-primary font-bold text-xl pt-3">MediBloom</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ id, label }) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  activeSection === id
                    ? 'text-primary'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                {label}
                {activeSection === id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
                  />
                )}
              </motion.a>
            ))}
          </nav>

          {/* Desktop right side — auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              /* ── Avatar + Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-label="Open profile menu"
                  aria-expanded={showDropdown}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full pl-1 pr-3 py-1 transition-colors"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=06a055&color=fff`}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{   opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 top-12 w-56 bg-heroBg/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=06a055&color=fff`}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
                            <p className="text-white/40 text-xs truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Only action: Log Out — all other profile links now
                          live in the wellness sidebar's Quick Links section */}
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <IoLogOutOutline className="w-4 h-4 flex-shrink-0" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Login button ── */
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
              >
                <FaGoogle className="w-3.5 h-3.5 text-[#4285F4]" />
                Sign In
              </motion.button>
            )}

            {/* Contact Us */}
            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
            >
              Contact Us
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden bg-heroBg/95 backdrop-blur-md border-t border-white/10"
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col px-4 py-4 gap-1">
                {NAV_LINKS.map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={(e) => handleNavClick(e, id)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === id
                          ? 'text-primary bg-primary/10'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}

                {/* Mobile auth row */}
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.04, duration: 0.2 }}
                  className="pt-2 border-t border-white/10 mt-1"
                >
                  {user ? (
                    <div className="flex flex-col">
                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=06a055&color=fff`}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{user.fullName}</p>
                          <p className="text-white/40 text-xs truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Log out — the only action here; all other profile
                          links now live in the wellness sidebar / mobile
                          profile drawer's Quick Links section */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors rounded-lg mx-1"
                      >
                        <IoLogOutOutline className="w-4 h-4 flex-shrink-0" />
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setIsOpen(false); setShowLogin(true); }}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl text-sm font-medium"
                    >
                      <FaGoogle className="w-3.5 h-3.5 text-[#4285F4]" />
                      Sign in with Google
                    </button>
                  )}
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (NAV_LINKS.length + 1) * 0.04, duration: 0.2 }}
                >
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="block text-center bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Contact Us
                  </a>
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Login Modal — rendered outside header to avoid stacking context issues */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Navbar;
