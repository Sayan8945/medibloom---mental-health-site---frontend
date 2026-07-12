import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { IoClose, IoSunny, IoMoon } from 'react-icons/io5';
import { MdAutoAwesome } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Settings quick link destination — surfaces the two preferences that
 * already exist elsewhere in the app (Personalized AI toggle from
 * Navbar.jsx, theme toggle from ThemeToggle.jsx) in one place. No new
 * business logic or API calls; reuses the same context methods.
 */
const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updatePersonalizedAI } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);

  const personalizedEnabled = user?.settings?.personalizedAI !== false;

  const handleToggleAI = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updatePersonalizedAI(!personalizedEnabled);
      toast.success(!personalizedEnabled ? 'Personalized AI enabled' : 'Personalized AI disabled');
    } catch {
      toast.error('Could not update your preference. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
            className="fixed inset-0 flex items-center justify-center z-[90] px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-sm pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-heroBg/95 backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl overflow-hidden">
                <button
                  onClick={onClose}
                  aria-label="Close settings"
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                >
                  <IoClose className="w-4 h-4" />
                </button>

                <h2 id="settings-modal-title" className="text-lg font-title font-bold text-white mb-5">
                  Settings
                </h2>

                <div className="space-y-2">
                  {/* Theme */}
                  <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5">
                    <span className="flex items-center gap-3 text-sm text-white/80">
                      {isDark ? <IoMoon className="w-4 h-4 text-amber-300" /> : <IoSunny className="w-4 h-4 text-amber-300" />}
                      {isDark ? 'Dark mode' : 'Light mode'}
                    </span>
                    <button
                      onClick={toggleTheme}
                      role="switch"
                      aria-checked={isDark}
                      aria-label="Toggle dark mode"
                      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${isDark ? 'bg-primary' : 'bg-white/20'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Personalized AI */}
                  <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5">
                    <span className="flex items-center gap-3 text-sm text-white/80">
                      <MdAutoAwesome className="w-4 h-4 text-primary" />
                      Personalized AI
                    </span>
                    <button
                      onClick={handleToggleAI}
                      disabled={saving}
                      role="switch"
                      aria-checked={personalizedEnabled}
                      aria-label="Toggle personalized AI chatbot responses"
                      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 disabled:opacity-60 ${personalizedEnabled ? 'bg-primary' : 'bg-white/20'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${personalizedEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
