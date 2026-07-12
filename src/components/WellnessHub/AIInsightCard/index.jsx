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

// Soft, calming tones only — no harsh reds/bright yellows, per the hub's
// "reduce visual fatigue" design requirement. "warning" uses a muted gold
// rather than a saturated alert color.
const STYLES = {
  positive: { bg: 'from-emerald-500/15 to-teal-500/5', border: 'border-emerald-500/25', icon: 'text-emerald-300', iconBg: 'bg-emerald-500/15' },
  warning:  { bg: 'from-amber-400/10 to-amber-500/5',  border: 'border-amber-400/20',   icon: 'text-amber-300',   iconBg: 'bg-amber-400/10' },
};

/**
 * Small AI-generated wellness insight card (sidebar section 5). Reuses the
 * rule-based insight text already generated server-side by
 * GET /api/mood/analytics (day-to-day) and GET /api/analytics/summary
 * (survey-based) — no new AI calls or endpoints, just surfaces the first
 * insight from whichever source has data. Updates automatically whenever
 * the sidebar's data reloads (e.g. after a new check-in).
 */
const AIInsightCard = ({ insight }) => {
  if (!insight) return null;

  const Icon = ICONS[insight.icon] || MdAutoAwesome;
  const s = STYLES[insight.type] || STYLES.positive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={`relative bg-gradient-to-br ${s.bg} border ${s.border} rounded-2xl p-3.5 flex items-start gap-3 overflow-hidden`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${s.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-0.5">
          AI Wellness Insight
        </p>
        <p className="text-xs text-white/80 leading-relaxed">{insight.text}</p>
      </div>
    </motion.div>
  );
};

export default AIInsightCard;
