import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import MoodCheckInForm from './MoodCheckInForm';

/**
 * Modal wrapper around MoodCheckInForm — used for the quick check-in flow
 * triggered from the dashboard widget / homepage CTA, matching the backdrop
 * + card pattern established in LoginModal.jsx (light card since the mood
 * check-in itself uses the light/dark-aware analytics card styling).
 */
const MoodCheckInModal = ({ isOpen, onClose, initialEntry, isEditing, onSubmit }) => (
  <AnimatePresence>
    {isOpen && (
      <>
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

        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mood-checkin-title"
          className="fixed inset-0 flex items-center justify-center z-[70] px-4 py-8 pointer-events-none overflow-y-auto"
        >
          <div
            className="relative w-full max-w-lg pointer-events-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-white/10 max-h-[85vh] overflow-y-auto">
              <button
                onClick={onClose}
                aria-label="Close check-in"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
              >
                <IoClose className="w-4 h-4" />
              </button>

              <h2 id="mood-checkin-title" className="text-xl font-title font-bold text-heroBg dark:text-white mb-1 pr-8">
                {isEditing ? "Edit Today's Check-in" : "Today's Check-in"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Takes less than 30 seconds.
              </p>

              <MoodCheckInForm
                initialEntry={initialEntry}
                isEditing={isEditing}
                onSubmit={onSubmit}
                onCancel={onClose}
              />
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MoodCheckInModal;
