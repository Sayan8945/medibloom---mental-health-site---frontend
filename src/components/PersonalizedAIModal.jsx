import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoShieldCheckmark } from 'react-icons/io5';
import { MdAutoAwesome, MdLockOutline } from 'react-icons/md';

// Confirmation pop-up shown right after the user toggles the
// "Personalized AI" chatbot preference — explains what changed.
const PersonalizedAIModal = ({ isOpen, onClose, enabled }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-pref-modal-title"
          className="fixed inset-0 flex items-center justify-center z-[70] px-4 pointer-events-none"
        >
          <div
            className="relative w-full max-w-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-heroBg/95 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl overflow-hidden">

              {/* Ambient orb */}
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
                  enabled ? 'bg-primary/20' : 'bg-white/10'
                }`}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
              >
                <IoClose className="w-4 h-4" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                  enabled ? 'bg-primary/15' : 'bg-white/10'
                }`}
              >
                {enabled
                  ? <MdAutoAwesome className="w-8 h-8 text-primary" />
                  : <MdLockOutline className="w-8 h-8 text-white/70" />}
              </motion.div>

              {/* Text */}
              <h2
                id="ai-pref-modal-title"
                className="text-xl font-title font-bold text-white text-center mb-2"
              >
                {enabled ? 'Personalized AI Enabled' : 'Personalized AI Disabled'}
              </h2>
              <p className="text-white/50 text-sm text-center leading-relaxed mb-6">
                {enabled
                  ? "MediBloom AI can now use your wellness assessment history — scores and trends — to tailor its replies to your journey."
                  : 'MediBloom AI will no longer use your wellness assessment history. You\u2019ll get general, non-personalized responses from now on.'}
              </p>

              {/* Confirm button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-md shadow-primary/25 transition-colors duration-150 text-sm mb-5"
              >
                Got it
              </motion.button>

              {/* Privacy note */}
              <p className="flex items-start gap-2 text-white/30 text-xs leading-relaxed">
                <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                You can change this anytime from your profile menu. Only your own summarized
                scores are ever used — never raw survey answers or other users' data.
              </p>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default PersonalizedAIModal;
