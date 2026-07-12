import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

// ── Calm color tiers — avoids harsh reds/bright yellows per spec ────
// Rose is only ever a muted accent, never a saturated alarm red.
const TIERS = {
  good:     { ring: '#34d399', text: 'text-emerald-300' }, // soft green
  moderate: { ring: '#fbbf24', text: 'text-amber-300'   }, // soft gold, not harsh yellow
  low:      { ring: '#fb7185', text: 'text-rose-300'    }, // muted rose, not alarm red
};

const getTier = (pct) => {
  if (pct === null) return 'moderate';
  if (pct >= 70) return 'good';
  if (pct >= 40) return 'moderate';
  return 'low';
};

/**
 * Small animated circular progress ring for the 3 headline scores
 * (Wellness / Stress / Sleep). Gradient fill via SVG stroke + a soft glow
 * filter; the numeric value counts up on mount using the app's existing
 * useCountUp hook (already used in SummaryStats.jsx).
 */
const ScoreRing = ({ label, value, max = 100, suffix = '', size = 64, delay = 0 }) => {
  const pct = value === null || value === undefined ? null : (value / max) * 100;
  const tier = getTier(pct);
  const colors = TIERS[tier];
  const animatedValue = useCountUp(value ?? 0, { duration: 1000 });

  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((pct ?? 0) / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1.5 flex-1"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: value === null ? circumference : offset }}
            transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${colors.ring}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold tabular-nums ${colors.text}`}>
            {value === null ? '—' : animatedValue}
          </span>
        </div>
      </div>
      <div className="text-center leading-tight">
        <p className="text-[11px] font-semibold text-white/70">{label}</p>
        <p className="text-[9px] text-white/30">{value === null ? 'No data' : `out of ${max}${suffix}`}</p>
      </div>
    </motion.div>
  );
};

export default ScoreRing;
