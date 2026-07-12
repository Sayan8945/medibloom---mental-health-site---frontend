import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoShieldCheckmark } from 'react-icons/io5';
import { MdEmail, MdVerified } from 'react-icons/md';

/**
 * Read-only "My Profile" quick-view — reuses the existing authenticated
 * user object from AuthContext. No new API calls, no new route; purely a
 * lightweight UI surface for the sidebar's "My Profile" quick link.
 */
const ProfileInfoModal = ({ isOpen, onClose, user }) => (
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
          aria-labelledby="profile-info-title"
          className="fixed inset-0 flex items-center justify-center z-[90] px-4 pointer-events-none"
        >
          <div
            className="relative w-full max-w-sm pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-heroBg/95 backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={onClose}
                aria-label="Close profile"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
              >
                <IoClose className="w-4 h-4" />
              </button>

              <div className="relative flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=06a055&color=fff`}
                    alt={user?.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/40"
                    referrerPolicy="no-referrer"
                  />
                  {user?.verified && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-heroBg">
                      <MdVerified className="w-3.5 h-3.5 text-white" />
                    </span>
                  )}
                </div>

                <h2 id="profile-info-title" className="text-lg font-title font-bold text-white">
                  {user?.fullName}
                </h2>

                <p className="flex items-center gap-1.5 text-white/50 text-sm">
                  <MdEmail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>

                <p className="flex items-start gap-2 text-white/30 text-xs leading-relaxed mt-4 text-left">
                  <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                  Signed in with Google. Your wellness data stays private and is never shared with
                  third parties.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default ProfileInfoModal;
