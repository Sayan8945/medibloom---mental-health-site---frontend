import { motion, AnimatePresence } from 'framer-motion';
import { IoLogOutOutline } from 'react-icons/io5';

/**
 * Confirmation dialog shown before actually logging the user out —
 * prevents accidental sign-outs from a stray click on the nav dropdown or
 * wellness hub quick link. Matches LoginModal's dark glass-card style
 * since both live in the always-dark nav/hub surfaces.
 */
const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={onCancel}
          aria-hidden="true"
        />
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
          className="fixed inset-0 flex items-center justify-center z-[101] px-4 pointer-events-none"
        >
          <div
            className="relative w-full max-w-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-heroBg/95 backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-400/20 mb-5 mx-auto">
                <IoLogOutOutline className="w-6 h-6 text-rose-400" />
              </div>

              <h2 id="logout-confirm-title" className="relative text-lg font-title font-bold text-white mb-2">
                Log out?
              </h2>
              <p className="relative text-white/50 text-sm leading-relaxed mb-6">
                You'll need to sign in again to access your wellness data.
              </p>

              <div className="relative flex gap-2.5">
                <button
                  onClick={onCancel}
                  className="flex-1 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 font-medium py-3 rounded-2xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl text-sm shadow-md shadow-rose-900/30 transition-colors"
                >
                  Log Out
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default LogoutConfirmModal;
