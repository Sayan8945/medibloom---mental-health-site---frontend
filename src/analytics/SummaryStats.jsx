import { motion } from 'framer-motion';
import { MdFavorite, MdEmojiEvents, MdShowChart, MdChecklist, MdTrendingUp } from 'react-icons/md';
import { useCountUp } from '../hooks/useCountUp';

const StatCard = ({ icon: Icon, label, value, suffix = '', accent, delay }) => {
  const animated = useCountUp(value, { duration: 1200 });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 flex flex-col gap-3"
    >
      <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${accent.text}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-heroBg dark:text-white tabular-nums leading-none">
          {animated}{suffix}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</p>
      </div>
    </motion.div>
  );
};

const SummaryStats = ({ summary }) => {
  const { current, best, average, count, improvement } = summary;

  const cards = [
    { icon: MdFavorite,   label: 'Current Wellness', value: current, suffix: '',  accent: { bg: 'bg-primary/10', text: 'text-primary' } },
    { icon: MdEmojiEvents,label: 'Best Score',       value: best,    suffix: '',  accent: { bg: 'bg-amber-100',   text: 'text-amber-600' } },
    { icon: MdShowChart,  label: 'Average Score',    value: average, suffix: '',  accent: { bg: 'bg-sky-100',     text: 'text-sky-600' } },
    { icon: MdChecklist,  label: 'Assessments',      value: count,   suffix: '',  accent: { bg: 'bg-violet-100',  text: 'text-violet-600' } },
    { icon: MdTrendingUp, label: 'Improvement',      value: improvement, suffix: '%', accent: { bg: improvement >= 0 ? 'bg-emerald-100' : 'bg-rose-100', text: improvement >= 0 ? 'text-emerald-600' : 'text-rose-600' } },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} delay={i * 0.06} />
      ))}
    </div>
  );
};

export default SummaryStats;
