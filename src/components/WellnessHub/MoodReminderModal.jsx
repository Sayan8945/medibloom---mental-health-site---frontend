import { motion, AnimatePresence } from 'framer-motion';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineMood } from 'react-icons/md';

/**
 * Daily mood-check reminder — shown once per browser session if today's
 * check-in hasn't happened yet. Timing/cooldown logic lives in
 * useWellnessHubData.js (6h snooze on dismiss, never again once completed
 * today). Purely a UI surface here.
 */
const MoodReminderModal = ({ isOpen, onCheckIn, onRemindLater }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95]"
          onClick={onRemindLater}
          aria-hidden="true"
        />
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mood-reminder-title"
          className="fixed inset-0 flex items-center justify-center z-[96] px-4 pointer-events-none"
        >
          <div
            className="relative w-full max-w-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white dark:bg-darkCard backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-3xl p-7 shadow-2xl overflow-hidden">
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary/5 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 dark:bg-emerald-500/15 border border-primary/15 dark:border-emerald-400/20 mb-5">
                <MdOutlineMood className="w-7 h-7 text-primary dark:text-emerald-300" />
              </div>

              <h2 id="mood-reminder-title" className="relative text-lg font-title font-bold text-heroBg dark:text-white mb-2">
                How are you feeling today?
              </h2>
              <p className="relative text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-5">
                A quick check-in helps track your wellbeing.
              </p>

              <p className="relative flex items-center gap-1.5 text-primary/80 dark:text-emerald-300/80 text-xs font-medium mb-6">
                <IoTimeOutline className="w-3.5 h-3.5" />
                Takes 15 seconds
              </p>

              <div className="relative flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onCheckIn}
                  className="w-full bg-gradient-to-r from-emerald-500 to-primary text-white font-semibold py-3 rounded-2xl text-sm shadow-md shadow-emerald-900/20 dark:shadow-emerald-900/30 transition-transform"
                >
                  Check In Now
                </motion.button>
                <button
                  onClick={onRemindLater}
                  className="w-full text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white/80 font-medium py-2 rounded-2xl text-sm transition-colors"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MoodReminderModal;
