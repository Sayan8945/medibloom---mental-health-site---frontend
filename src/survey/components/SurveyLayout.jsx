import { motion } from 'framer-motion';
import { STEP_TITLES, TOTAL_STEPS } from '../data/surveySteps';
import { IoChevronBack, IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -32 },
};

const SurveyLayout = ({ step, progress, onBack, children, hideBack = false }) => {
  const navigate = useNavigate();
  const isWelcome = step === 0;
  const isResults = step === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] font-primary pt-16">

      {/* ── Sticky progress bar — sits just below the fixed Navbar ── */}
      {!isWelcome && !isResults && (
        <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Back to previous step */}
            <button
              onClick={onBack}
              aria-label="Previous step"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            >
              <IoChevronBack className="w-5 h-5" />
            </button>

            {/* Step label + progress */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-gray-500 truncate">
                  {STEP_TITLES[step]}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {step} / {TOTAL_STEPS - 1}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Home link */}
            <button
              onClick={() => navigate('/')}
              aria-label="Back to home"
              title="Back to Home"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            >
              <IoHomeOutline className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* Home link for welcome & results screens */}
      {(isWelcome || isResults) && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <IoChevronBack className="w-4 h-4" />
            Back to Home
          </button>
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
  );
};

export default SurveyLayout;
