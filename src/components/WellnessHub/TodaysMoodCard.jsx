import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdLocalFireDepartment } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
import { IoFlashOutline, IoMoonOutline, IoFlameOutline } from 'react-icons/io5';
import { getMoodMeta } from '../../mood/moodConstants';

// ── Compact metric badge (⚡ Energy 🔥 Stress 🌙 Sleep) ──────────
const MetricBadge = ({ icon: Icon, value, color }) => (
  <span className="flex items-center gap-1 text-[11px] font-semibold text-white/70">
    <Icon className="w-3.5 h-3.5" style={{ color }} />
    {value}/10
  </span>
);

const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse space-y-3">
    <div className="h-3.5 bg-white/10 rounded w-2/5" />
    <div className="h-12 bg-white/10 rounded-xl" />
    <div className="h-3 bg-white/10 rounded w-3/4" />
  </div>
);

/**
 * Hub section 2 — Today's Mood. Compact card layout per spec: emoji +
 * label, check-in status/time, and a condensed energy/stress/sleep row,
 * plus the check-in streak badge. Reuses GET /api/mood/today +
 * GET /api/mood/analytics — no new endpoints.
 */
const TodaysMoodCard = memo(function TodaysMoodCard({ loading, entry, analytics, onOpenCheckIn, onNavigate }) {
  const navigate = useNavigate();
  if (loading) return <CardSkeleton />;

  const moodMeta = entry ? getMoodMeta(entry.mood) : null;
  const streak = analytics?.streaks?.current ?? 0;
  const goToTrends = () => (onNavigate ? onNavigate('/mood') : navigate('/mood'));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
          Today's Mood
        </h3>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300/90 bg-amber-400/10 rounded-full px-2 py-0.5">
            <MdLocalFireDepartment className="w-3.5 h-3.5" />
            {streak} Day Streak
          </span>
        )}
      </div>

      {entry ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between gap-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl px-3.5 py-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl leading-none flex-shrink-0">{moodMeta?.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-none">{moodMeta?.label}</p>
              <p className="text-[10px] text-white/40 mt-1 leading-none truncate">
                {entry.createdAt
                  ? `Checked in at ${new Date(entry.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                  : 'Checked in today'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            <MetricBadge icon={IoFlashOutline} value={entry.energyLevel} color="#fbbf24" />
            <MetricBadge icon={IoFlameOutline} value={entry.stressLevel} color="#fb7185" />
            <MetricBadge icon={IoMoonOutline} value={entry.sleepQuality} color="#38bdf8" />
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-2.5">
          <p className="text-xs text-white/50 mb-3">You haven't checked in today</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCheckIn}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-primary text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-900/30 transition-transform hover:scale-[1.02]"
          >
            Start Check-in <FaArrowRight className="w-2.5 h-2.5" />
          </motion.button>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={goToTrends}
        className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-400/20 rounded-xl py-2 transition-colors"
      >
        View Trends <FaArrowRight className="w-2.5 h-2.5" />
      </motion.button>
    </div>
  );
});

export default TodaysMoodCard;
