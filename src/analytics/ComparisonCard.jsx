import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

/**
 * Displays the latest-vs-previous comparison for each wellness dimension.
 * `comparison` is the array returned by GET /api/analytics/comparison.
 */
const ComparisonCard = ({ comparison, hasComparison }) => {
  if (!hasComparison) {
    return (
      <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Complete a second assessment to see how your scores are changing over time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {comparison.map((item, i) => {
        const noChange = item.change === 0 || item.change === null;
        const improved = item.improved;

        const accent = noChange
          ? { text: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-white/5', Icon: FaMinus, sign: '' }
          : improved
          ? { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', Icon: FaArrowUp, sign: '+' }
          : { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', Icon: FaArrowDown, sign: '' };

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${accent.bg} ${accent.text}`}>
                <accent.Icon className="w-2.5 h-2.5" />
                {accent.sign}{item.change}
                {!noChange && (improved ? ' Improvement' : ' Decline')}
              </span>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 line-through decoration-1">
                {item.previous}
              </span>
              <span className="text-gray-300 dark:text-gray-600 text-lg mb-0.5">&rarr;</span>
              <span className="text-3xl font-bold text-heroBg dark:text-white">{item.current}</span>
            </div>

            {/* Progress bar comparison */}
            <div className="mt-3 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className={`h-full rounded-full ${improved ? 'bg-emerald-500' : noChange ? 'bg-gray-400' : 'bg-rose-500'}`}
                initial={{ width: `${item.previous}%` }}
                animate={{ width: `${item.current}%` }}
                transition={{ duration: 0.8, delay: i * 0.06 + 0.2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ComparisonCard;
