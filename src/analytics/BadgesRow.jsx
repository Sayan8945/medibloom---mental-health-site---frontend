import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdStar, MdLocalFireDepartment, MdMilitaryTech,
  MdNightlight, MdEnergySavingsLeaf, MdEmojiEvents, MdLocalFlorist,
  MdLock, MdExpandMore, MdExpandLess,
} from 'react-icons/md';

// On mobile, collapse the grid to this many badges with a "Show more" toggle
const MOBILE_COLLAPSED_COUNT = 2;

const ICONS = {
  star:   MdStar,
  fire:   MdLocalFireDepartment,
  medal:  MdMilitaryTech,
  moon:   MdNightlight,
  leaf:   MdEnergySavingsLeaf,
  trophy: MdEmojiEvents,
  flower: MdLocalFlorist,
};

const COLORS = {
  star:   { bg: 'bg-amber-100 dark:bg-amber-500/15',     text: 'text-amber-600 dark:text-amber-400' },
  fire:   { bg: 'bg-orange-100 dark:bg-orange-500/15',   text: 'text-orange-600 dark:text-orange-400' },
  medal:  { bg: 'bg-violet-100 dark:bg-violet-500/15',   text: 'text-violet-600 dark:text-violet-400' },
  moon:   { bg: 'bg-sky-100 dark:bg-sky-500/15',         text: 'text-sky-600 dark:text-sky-400' },
  leaf:   { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
  trophy: { bg: 'bg-rose-100 dark:bg-rose-500/15',       text: 'text-rose-600 dark:text-rose-400' },
  flower: { bg: 'bg-pink-100 dark:bg-pink-500/15',       text: 'text-pink-600 dark:text-pink-400' },
};

const BadgesRow = ({ badges }) => {
  const [expanded, setExpanded] = useState(false);
  if (!badges || badges.length === 0) return null;

  const earnedCount = badges.filter((b) => b.earned).length;
  const hasHidden = badges.length > MOBILE_COLLAPSED_COUNT;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-title font-bold text-heroBg dark:text-white flex items-center gap-2">
          <MdMilitaryTech className="w-5 h-5 text-primary" />
          Achievements
        </h2>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
          {earnedCount} / {badges.length} unlocked
        </span>
      </div>

      {/* Wrapping grid — no horizontal scroll, adapts to available width.
          On mobile (< sm) only the first MOBILE_COLLAPSED_COUNT badges show
          unless expanded; sm+ always shows the full grid. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {badges.map((badge, i) => {
          const Icon = ICONS[badge.icon] || MdStar;
          const c = COLORS[badge.icon] || COLORS.star;
          const locked = !badge.earned;
          const hiddenOnMobile = !expanded && i >= MOBILE_COLLAPSED_COUNT;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: Math.min(i, MOBILE_COLLAPSED_COUNT) * 0.05 }}
              whileHover={{ y: -3, scale: locked ? 1 : 1.03 }}
              className={`relative bg-white dark:bg-darkCard rounded-2xl border shadow-sm p-4 text-center ${
                hiddenOnMobile ? 'hidden sm:block' : ''
              } ${
                locked
                  ? 'border-gray-100 dark:border-white/10 opacity-60'
                  : 'border-gray-100 dark:border-white/10'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
                  locked ? 'bg-gray-100 dark:bg-white/5' : c.bg
                }`}
              >
                {locked
                  ? <MdLock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  : <Icon className={`w-6 h-6 ${c.text}`} />}
              </div>
              <p className={`text-sm font-semibold leading-tight mb-1 ${
                locked ? 'text-gray-400 dark:text-gray-500' : 'text-heroBg dark:text-white'
              }`}>
                {badge.label}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-snug">{badge.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Show more/less — mobile only, sm+ already sees the full grid */}
      {hasHidden && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="sm:hidden w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl py-2.5 transition-colors"
        >
          {expanded ? (
            <>Show less <MdExpandLess className="w-4 h-4" /></>
          ) : (
            <>Show {badges.length - MOBILE_COLLAPSED_COUNT} more <MdExpandMore className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
};

export default BadgesRow;
