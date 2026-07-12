import { motion } from 'framer-motion';
import { getMoodMeta, fmtDay } from './moodConstants';
import { MdEnergySavingsLeaf } from 'react-icons/md';
import { FaCloudRain } from 'react-icons/fa';
import { IoMoonOutline } from 'react-icons/io5';

const MiniStat = ({ icon: Icon, value, color }) => (
  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
    <Icon className="w-3 h-3" style={{ color }} />
    {value}/10
  </span>
);

/**
 * Paginated list of past check-ins. `entries` newest-first (as returned by
 * GET /api/mood/history). `pagination` drives the Prev/Next controls.
 */
const MoodHistoryList = ({ entries, pagination, onPageChange }) => {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const meta = getMoodMeta(entry.mood);
        return (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.03, ease: 'easeOut' }}
            className="flex items-center gap-4 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4"
          >
            <span className="text-2xl flex-shrink-0">{meta?.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-heroBg dark:text-white">{meta?.label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{fmtDay(entry.date)}</span>
              </div>
              {entry.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic truncate">“{entry.notes}”</p>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <MiniStat icon={MdEnergySavingsLeaf} value={entry.energyLevel} color="#f59e0b" />
              <MiniStat icon={FaCloudRain} value={entry.stressLevel} color="#f43f5e" />
              <MiniStat icon={IoMoonOutline} value={entry.sleepQuality} color="#0ea5e9" />
            </div>
          </motion.div>
        );
      })}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-darkCard border border-gray-100 dark:border-white/10 disabled:opacity-40 hover:border-primary/40 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasMore}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-darkCard border border-gray-100 dark:border-white/10 disabled:opacity-40 hover:border-primary/40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodHistoryList;
