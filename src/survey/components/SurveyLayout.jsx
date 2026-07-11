import { motion } from 'framer-motion';
import { STEP_TITLES, TOTAL_STEPS } from '../data/surveySteps';
import { IoChevronBack, IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

const pageVariants = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -32 },
};

const SurveyLayout = ({ step, progress, onBack, children, hideBack = false }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isWelcome = step === 0;
  const isResults = step === TOTAL_STEPS;

  return (
    <div className={isDark ? 'dark' : ''}>
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] dark:bg-none dark:bg-darkBg font-primary pt-16 transition-colors duration-300">

      {/* ── Sticky progress bar — sits just below the fixed Navbar ── */}
      {!isWelcome && !isResults && (
        <div className="sticky top-16 z-40 bg-white/90 dark:bg-darkCard/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Back to previous step */}
            <button
              onClick={onBack}
              aria-label="Previous step"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            >
              <IoChevronBack className="w-5 h-5" />
            </button>

            {/* Step label + progress */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 truncate">
                  {STEP_TITLES[step]}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                  {step} / {TOTAL_STEPS - 1}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Theme toggle */}
            <ThemeToggle className="!w-8 !h-8" />

            {/* Home link */}
            <button
              onClick={() => navigate('/')}
              aria-label="Back to home"
              title="Back to Home"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            >
              <IoHomeOutline className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* Home link + theme toggle for welcome & results screens */}
      {(isWelcome || isResults) && (
        <div className="max-w-2xl mx-auto px-4 pt-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-sm font-medium transition-colors"
          >
            <IoChevronBack className="w-4 h-4" />
            Back to Home
          </button>
          <ThemeToggle showLabel />
        </div>
      )}

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </div>
    </div>
  );
};

export default SurveyLayout;
