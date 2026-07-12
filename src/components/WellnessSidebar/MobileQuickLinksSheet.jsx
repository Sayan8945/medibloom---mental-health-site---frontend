import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import ProfileQuickLinks from './ProfileQuickLinks';

/**
 * Mobile-only bottom sheet housing the full Quick Links list — keeps the
 * stacked mobile drawer short (profile + mood + actions only) instead of
 * repeating the long vertical link list inline, per the "avoid long
 * vertical lists on mobile" requirement.
 */
const MobileQuickLinksSheet = ({ isOpen, onClose, onNavigate, onAction, onLogout }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          key="sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Account quick links"
          className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-heroBg border-t border-white/10 rounded-t-3xl px-4 pt-3 pb-6 max-h-[75vh] overflow-y-auto scroll-thin"
        >
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-semibold text-white">Account & Settings</h3>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>
          <ProfileQuickLinks onNavigate={onNavigate} onAction={onAction} onLogout={onLogout} />
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MobileQuickLinksSheet;
