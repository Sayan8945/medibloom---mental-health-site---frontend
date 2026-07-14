import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { MdLock } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// Shown while the auth session is being checked
const AuthSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
          />
        ))}
        <div className="absolute inset-0 rounded-full bg-primary" />
      </div>
      <p className="text-gray-400 text-sm font-medium animate-pulse">Verifying session…</p>
    </div>
  </div>
);

// Shown when user is not authenticated
const LoginRequired = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-heroBg flex flex-col items-center justify-center px-4 font-primary overflow-hidden">
      {/* Ambient orbs */}
      {[
        'w-72 h-72 bg-primary top-[-60px] left-[-60px]',
        'w-56 h-56 bg-violet-600 bottom-0 right-[-40px]',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full pointer-events-none opacity-15 blur-3xl ${cls}`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i }}
        />
      ))}

      {/* Back to Home */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        onClick={() => navigate('/')}
        className="relative flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors mb-6"
      >
        <IoArrowBack className="w-4 h-4" />
        Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mx-auto mb-6">
          <MdLock className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-2xl font-title font-bold text-white mb-3">Sign In Required</h2>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          Please sign in with your Google account to participate in the{' '}
          <span className="text-primary font-medium">Mental Wellness Assessment</span>.
          Your responses are private and secure.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3.5 rounded-2xl shadow-lg transition-colors duration-150 text-sm"
        >
          <FaGoogle className="w-4 h-4 text-[#4285F4]" />
          Continue with Google
        </motion.button>

        <p className="text-white/30 text-xs mt-6 leading-relaxed">
          By signing in you agree to our wellness screening terms. This tool is not a substitute for
          professional medical advice.
        </p>
      </motion.div>
    </div>
  );
};

/**
 * Wraps a route — redirects unauthenticated users to the LoginRequired screen.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading, loginWithGoogle } = useAuth();

  if (loading) return <AuthSkeleton />;
  if (!user)   return <LoginRequired onLogin={loginWithGoogle} />;

  return children;
};

export default ProtectedRoute;
