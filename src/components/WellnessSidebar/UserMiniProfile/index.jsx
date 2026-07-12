import { useState } from 'react';
import { motion } from 'framer-motion';

// ── Time-of-day greeting ─────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

// ── Color-coded metric chip (green/yellow/red per the spec) ──────
// `higherIsBetter` flips the thresholds for metrics like Stress where a
// *lower* score is the good outcome.
const METRIC_COLORS = {
  good:     { text: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/30' },
  moderate: { text: 'text-amber-400',   bg: 'bg-amber-500/15',   ring: 'ring-amber-500/30' },
  low:      { text: 'text-rose-400',    bg: 'bg-rose-500/15',    ring: 'ring-rose-500/30' },
};

const getLevel = (value, { higherIsBetter = true, max = 100 } = {}) => {
  if (value === null || value === undefined) return null;
  const pct = higherIsBetter ? (value / max) * 100 : 100 - (value / max) * 100;
  if (pct >= 70) return 'good';
  if (pct >= 40) return 'moderate';
  return 'low';
};

const MetricChip = ({ label, value, suffix, level, delay }) => {
  const colors = level ? METRIC_COLORS[level] : METRIC_COLORS.moderate;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={`flex flex-col items-center gap-0.5 rounded-xl py-2 px-1.5 flex-1 ring-1 ${colors.bg} ${colors.ring}`}
    >
      <span className={`text-sm font-bold tabular-nums leading-none ${colors.text}`}>
        {value ?? '—'}{value !== null && value !== undefined ? suffix : ''}
      </span>
      <span className="text-[9px] text-white/40 leading-none text-center">{label}</span>
    </motion.div>
  );
};

/**
 * Compact "who's signed in" header for the sidebar — Google avatar,
 * time-of-day greeting, and the 3 headline wellness metrics (Wellness /
 * Stress / Sleep) with green/yellow/red color indicators, per spec.
 * Reuses `useAuth()`'s existing `user` object and the survey-based
 * `/api/analytics/trends` radar snapshot — no new API calls. Clicking the
 * avatar opens a lightweight profile modal.
 */
const UserMiniProfile = ({ user, onOpenProfile, wellnessScores }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=06a055&color=fff`;
  const firstName = user?.fullName?.split(' ')[0] || '';

  const wellness = wellnessScores?.wellness ?? null;
  const stress = wellnessScores?.stress ?? null; // higher = better (matches scoring.js convention)
  const sleep = wellnessScores?.sleep ?? null;

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 space-y-3">
      <motion.button
        onClick={onOpenProfile}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`View profile for ${user?.fullName || 'your account'}`}
        className="w-full flex items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-primary focus:outline-none rounded-xl"
      >
        <div className="relative flex-shrink-0">
          <motion.img
            src={imgError ? fallbackAvatar : (user?.avatar || fallbackAvatar)}
            onError={() => setImgError(true)}
            alt={user?.fullName}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover border-2 border-white/10"
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          />
          {/* Soft pulse ring on hover */}
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/40 pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            whileHover={{ opacity: [0.5, 0], scale: [1, 1.4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-heroBg" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-white/50 text-[11px] font-medium truncate leading-none">{getGreeting()},</p>
          <p className="text-white text-sm font-semibold truncate mt-0.5 flex items-center gap-1">
            {firstName} <span aria-hidden="true">👋</span>
          </p>
        </div>
      </motion.button>

      {/* 3 headline wellness metrics — capped at these 3 to avoid
          overwhelming the dashboard, per spec */}
      <div className="flex gap-1.5">
        <MetricChip
          label="Wellness"
          value={wellness}
          suffix="/100"
          level={getLevel(wellness, { higherIsBetter: true, max: 100 })}
          delay={0}
        />
        <MetricChip
          label="Stress"
          value={stress !== null ? Math.round(stress / 10) : null}
          suffix="/10"
          level={getLevel(stress, { higherIsBetter: true, max: 100 })}
          delay={0.05}
        />
        <MetricChip
          label="Sleep"
          value={sleep !== null ? Math.round(sleep / 10) : null}
          suffix="/10"
          level={getLevel(sleep, { higherIsBetter: true, max: 100 })}
          delay={0.1}
        />
      </div>
    </div>
  );
};

export default UserMiniProfile;
