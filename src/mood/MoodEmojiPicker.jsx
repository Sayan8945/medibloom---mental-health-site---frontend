import { motion } from 'framer-motion';
import { MOOD_OPTIONS } from './moodConstants';

/**
 * Emoji-based mood picker — 5 options, 1-5 numerical value stored underneath.
 */
const MoodEmojiPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-5 gap-2 sm:gap-3">
    {MOOD_OPTIONS.map((opt, i) => {
      const selected = value === opt.value;
      return (
        <motion.button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.04 }}
          whileHover={{ y: -3, scale: selected ? 1.05 : 1.03 }}
          whileTap={{ scale: 0.95 }}
          aria-pressed={selected}
          aria-label={opt.label}
          className={`flex flex-col items-center gap-1.5 py-3 sm:py-4 rounded-2xl border-2 transition-colors duration-150 ${
            selected
              ? 'border-primary bg-primary/10 dark:bg-primary/15'
              : 'border-gray-100 dark:border-white/10 bg-white dark:bg-darkCard hover:border-primary/40'
          }`}
        >
          <motion.span
            className="text-2xl sm:text-3xl leading-none"
            animate={selected ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {opt.emoji}
          </motion.span>
          <span
            className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
              selected ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {opt.label}
          </span>
        </motion.button>
      );
    })}
  </div>
);

export default MoodEmojiPicker;
