import { motion } from 'framer-motion';
import {
  MdShield, MdPsychology, MdFavorite, MdNightlight,
  MdEnergySavingsLeaf, MdGroups, MdAutoAwesome,
} from 'react-icons/md';

const CATEGORY = {
  stress:    { icon: MdShield,            bg: 'bg-amber-100 dark:bg-amber-500/15',     text: 'text-amber-600 dark:text-amber-400',   label: 'Stress' },
  anxiety:   { icon: MdPsychology,        bg: 'bg-violet-100 dark:bg-violet-500/15',   text: 'text-violet-600 dark:text-violet-400', label: 'Anxiety' },
  mood:      { icon: MdFavorite,          bg: 'bg-rose-100 dark:bg-rose-500/15',       text: 'text-rose-600 dark:text-rose-400',     label: 'Mood' },
  sleep:     { icon: MdNightlight,        bg: 'bg-sky-100 dark:bg-sky-500/15',         text: 'text-sky-600 dark:text-sky-400',       label: 'Sleep' },
  lifestyle: { icon: MdEnergySavingsLeaf, bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', label: 'Lifestyle' },
  social:    { icon: MdGroups,            bg: 'bg-teal-100 dark:bg-teal-500/15',       text: 'text-teal-600 dark:text-teal-400',     label: 'Social' },
  general:   { icon: MdAutoAwesome,       bg: 'bg-primary/10',                         text: 'text-primary',                          label: 'General' },
};

const PRIORITY_DOT = {
  high:   'bg-rose-500',
  medium: 'bg-amber-500',
  low:    'bg-emerald-500',
};

const RecommendationCard = ({ recommendation, index }) => {
  const { title, description, category, priority } = recommendation;
  const meta = CATEGORY[category] || CATEGORY.general;
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 flex gap-4"
    >
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${meta.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${meta.text}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[priority] || PRIORITY_DOT.medium}`} aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {meta.label}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-heroBg dark:text-white leading-snug mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
