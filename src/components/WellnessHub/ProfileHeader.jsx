import { useState } from 'react';
import { motion } from 'framer-motion';
import ScoreRing from './ScoreRing';

// ── Time-of-day greeting + icon ─────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: '☀️' };
  if (h < 17) return { text: 'Good Afternoon', icon: '🌤️' };
  if (h < 21) return { text: 'Good Evening', icon: '🌆' };
  return { text: 'Good Night', icon: '🌙' };
};

/**
 * Hub section 1 — Google avatar, name/email, time-of-day greeting, and the
 * 3 headline scores as animated circular progress rings (Wellness/Stress/
 * Sleep). Reuses `useAuth()`'s existing `user` object and the survey-based
 * `/api/analytics/trends` radar snapshot — no new API calls.
 */
const ProfileHeader = ({ user, onOpenProfile, wellnessScores }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=06a055&color=fff`;
  const firstName = user?.fullName?.split(' ')[0] || '';
  const greeting = getGreeting();

  const wellness = wellnessScores?.wellness ?? null;
  const stress = wellnessScores?.stress !== null && wellnessScores?.stress !== undefined
    ? Math.round(wellnessScores.stress / 10) : null; // 0-100 -> 0-10
  const sleep = wellnessScores?.sleep !== null && wellnessScores?.sleep !== undefined
    ? Math.round(wellnessScores.sleep / 10) : null;

  return (
    <div className="space-y-4">
      <motion.button
        onClick={onOpenProfile}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`View profile for ${user?.fullName || 'your account'}`}
        className="w-full flex items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-none rounded-2xl"
      >
        <div className="relative flex-shrink-0">
          <motion.img
            src={imgError ? fallbackAvatar : (user?.avatar || fallbackAvatar)}
            onError={() => setImgError(true)}
            alt={user?.fullName}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/20"
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          />
          {/* Soft breathing ring around the avatar */}
          <motion.span
            className="absolute inset-0 rounded-full bg-emerald-400/30 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0b0e1a]" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-white/50 text-[11px] font-medium truncate leading-none flex items-center gap-1">
            {greeting.text}, <span aria-hidden="true">{greeting.icon}</span>
          </p>
          <p className="text-white text-base font-semibold truncate mt-1 leading-none">
            {firstName}
          </p>
          <p className="text-white/30 text-[11px] truncate mt-0.5">{user?.email}</p>
        </div>
      </motion.button>

      {/* 3 headline scores — capped at these 3 to avoid overwhelming the
          dashboard, per spec */}
      <div className="flex items-start justify-between gap-1 bg-white/[0.03] border border-white/10 rounded-2xl px-2 py-4">
        <ScoreRing label="Wellness" value={wellness} max={100} delay={0} />
        <ScoreRing label="Stress" value={stress} max={10} delay={0.08} />
        <ScoreRing label="Sleep" value={sleep} max={10} delay={0.16} />
      </div>
    </div>
  );
};

export default ProfileHeader;
