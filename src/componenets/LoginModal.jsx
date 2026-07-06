import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoShieldCheckmark } from 'react-icons/io5';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();

  return (
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
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.93,  y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="fixed inset-0 flex items-center justify-center z-[70] px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-sm pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass card */}
              <div className="relative bg-heroBg/95 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl overflow-hidden">

                {/* Ambient orb inside card */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close login modal"
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                >
                  <IoClose className="w-4 h-4" />
                </button>

                {/* Logo mark */}
                <div className="flex items-center justify-center mb-5 mx-auto">
                  <img src="/logo.png" alt="MediBloom" className="h-14 w-auto" />
                </div>

                {/* Text */}
                <h2
                  id="login-modal-title"
                  className="text-2xl font-title font-bold text-white text-center mb-2"
                >
                  Welcome Back
                </h2>
                <p className="text-white/50 text-sm text-center leading-relaxed mb-7">
                  Sign in to access your wellness assessment, track progress, and get
                  AI-powered insights.
                </p>

                {/* Google button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3.5 rounded-2xl shadow-md transition-colors duration-150 text-sm mb-5"
                >
                  <FaGoogle className="w-4 h-4 text-[#4285F4]" />
                  Continue with Google
                </motion.button>

                {/* Privacy note */}
                <p className="flex items-start gap-2 text-white/30 text-xs leading-relaxed">
                  <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                  Your data is encrypted and never sold. This platform is a wellness screening
                  tool — not a medical service.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
