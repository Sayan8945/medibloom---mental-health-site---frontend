import { motion } from 'framer-motion';
import {
  MdTrendingUp, MdTrendingDown, MdAutoAwesome,
  MdShield, MdNightlight, MdWarningAmber,
} from 'react-icons/md';

const ICONS = {
  'trending-up':   MdTrendingUp,
  'trending-down': MdTrendingDown,
  sparkles:        MdAutoAwesome,
  shield:          MdShield,
  moon:            MdNightlight,
  alert:           MdWarningAmber,
};

const STYLES = {
  positive: { bg: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-200 dark:border-emerald-500/25', icon: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-500/15' },
  warning:  { bg: 'from-amber-500/10 to-orange-500/5',  border: 'border-amber-200 dark:border-amber-500/25',   icon: 'text-amber-600 dark:text-amber-400',   iconBg: 'bg-amber-100 dark:bg-amber-500/15' },
};

const InsightsPanel = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-title font-bold text-heroBg dark:text-white flex items-center gap-2">
        <MdAutoAwesome className="w-5 h-5 text-primary" />
        AI Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, i) => {
          const Icon = ICONS[insight.icon] || MdAutoAwesome;
          const s = STYLES[insight.type] || STYLES.positive;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className={`relative bg-gradient-to-br ${s.bg} border ${s.border} rounded-2xl p-4 flex items-start gap-3 overflow-hidden`}
            >
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${s.icon}`} />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{insight.text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;
