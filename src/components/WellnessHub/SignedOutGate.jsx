import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import { MdOutlineMood, MdInsights, MdLightbulbOutline } from 'react-icons/md';
import { IoDocumentTextOutline, IoShieldCheckmark } from 'react-icons/io5';

const FEATURES = [
  { icon: MdOutlineMood, label: 'Mood Tracking' },
  { icon: IoDocumentTextOutline, label: 'AI Wellness Assistant' },
  { icon: MdInsights, label: 'Assessment History' },
  { icon: MdLightbulbOutline, label: 'Personalized Insights' },
  { icon: MdInsights, label: 'Wellness Reports' },
];

/**
 * Shown inside the panel when isSignedIn is false. Never renders any
 * private data or protected-route content — just the value proposition +
 * a single "Continue with Google" CTA that reuses the existing OAuth flow.
 */
const SignedOutGate = ({ onLogin }) => (
  <div className="flex flex-col items-center text-center px-2 py-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-primary/10 border border-emerald-400/20 flex items-center justify-center mb-5"
    >
      <img src="/logo.png" alt="" className="w-9 h-9 object-contain" aria-hidden="true" />
    </motion.div>

    <h2 className="text-xl font-title font-bold text-white mb-2">Welcome to MediBloom</h2>
    <p className="text-white/50 text-sm leading-relaxed mb-6">Sign in to unlock:</p>

    <div className="w-full space-y-2 mb-7">
      {FEATURES.map(({ icon: Icon, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: 'easeOut' }}
          className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-left"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-emerald-300" />
          </span>
          <span className="text-sm text-white/70 font-medium">{label}</span>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onLogin}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3.5 rounded-2xl shadow-md transition-colors duration-150 text-sm"
    >
      <FaGoogle className="w-4 h-4 text-[#4285F4]" />
      Continue with Google
    </motion.button>

    <p className="flex items-start gap-2 text-white/30 text-xs leading-relaxed mt-6 text-left">
      <IoShieldCheckmark className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" />
      Your data is encrypted and never sold. This platform is a wellness screening tool — not a
      medical service.
    </p>
  </div>
);

export default SignedOutGate;
