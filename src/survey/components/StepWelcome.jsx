import { motion } from 'framer-motion';
import { MdAutoAwesome } from 'react-icons/md';
import { IoShieldCheckmark, IoTimeOutline, IoListOutline } from 'react-icons/io5';
import { FaArrowRight } from 'react-icons/fa';

const HIGHLIGHTS = [
  { icon: IoTimeOutline,      text: '3–5 minutes to complete' },
  { icon: IoListOutline,      text: '12 sections, ~50 questions' },
  { icon: IoShieldCheckmark,  text: '100% confidential & secure' },
];

const StepWelcome = ({ onStart }) => (
  <div className="flex flex-col items-center text-center gap-8 py-6">

    {/* Animated orb illustration */}
    <div className="relative w-32 h-32">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-3 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <MdAutoAwesome className="w-14 h-14 text-primary" />
      </div>
    </div>

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-3"
    >
      <h1 className="text-3xl sm:text-4xl font-title font-bold text-heroBg dark:text-white leading-tight">
        Your Mental Wellness<br />
        <span className="text-primary">Assessment</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto leading-relaxed">
        Answer a few confidential questions and receive a personalised AI-powered wellness report.
        There are no right or wrong answers — just honest reflections.
      </p>
    </motion.div>

    {/* Highlights */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
    >
      {HIGHLIGHTS.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex-1 flex flex-col items-center gap-2 bg-white dark:bg-darkCard rounded-2xl px-4 py-4 border border-gray-100 dark:border-white/10 shadow-sm"
        >
          <Icon className="w-5 h-5 text-primary" />
          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium text-center leading-snug">{text}</span>
        </div>
      ))}
    </motion.div>

    {/* Privacy notice */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-xs text-gray-400 dark:text-gray-500 max-w-sm leading-relaxed"
    >
      <IoShieldCheckmark className="inline w-3.5 h-3.5 text-primary mr-1 align-text-bottom" />
      Your responses are private and secure. This is a wellness screening tool, not a medical diagnosis.
    </motion.p>

    {/* CTA */}
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onStart}
      className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-4 rounded-2xl shadow-lg shadow-primary/25 transition-colors duration-200 text-base"
    >
      Start Assessment
      <FaArrowRight className="w-4 h-4" />
    </motion.button>
  </div>
);

export default StepWelcome;
