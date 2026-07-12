import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdEnergySavingsLeaf } from 'react-icons/md';
import { FaCloudRain, FaArrowRight } from 'react-icons/fa';
import { IoMoonOutline, IoSparkles } from 'react-icons/io5';
import { getMoodMeta } from '../../../mood/moodConstants';
import SidebarStats from '../SidebarStats';

// ── Metric row (energy/stress/sleep) — dark glass variant ──────
const MetricRow = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-xs text-white/50">
      <Icon className="w-3.5 h-3.5" style={{ color }} />
      {label}
    </span>
    <span className="text-xs font-bold text-white tabular-nums">{value}/10</span>
  </div>
);

const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse space-y-3">
    <div className="h-4 bg-white/10 rounded w-2/5" />
    <div className="h-14 bg-white/10 rounded-xl" />
    <div className="space-y-2">
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-full" />
    </div>
    <div className="flex gap-2">
      {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-white/10 rounded-xl flex-1" />)}
    </div>
  </div>
);

/**
 * Sidebar's "Today's Mood" section — the single source of truth for mood
 * check-in status on the homepage now that the standalone card below the
 * hero has been removed. Reuses the same /api/mood/today + /api/mood/analytics
 * endpoints as the rest of the app; `onOpenCheckIn` is passed down from
 * WellnessSidebar so the check-in modal only needs to exist once.
 */
const TodaysMoodCard = memo(function TodaysMoodCard({ loading, entry, analytics, onOpenCheckIn }) {
  const navigate = useNavigate();

  if (loading) return <CardSkeleton />;

  const moodMeta = entry ? getMoodMeta(entry.mood) : null;
  const weeklyAverage = analytics?.weeklyAverages?.length
    ? analytics.weeklyAverages[analytics.weeklyAverages.length - 1].average
    : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
          <IoSparkles className="w-3.5 h-3.5 text-primary" />
          Today's Mood
        </h3>
        {entry && (
          <button
            onClick={onOpenCheckIn}
            className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {entry ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-3"
          >
            <span className="text-2xl leading-none">{moodMeta?.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-none">{moodMeta?.label}</p>
              <p className="text-[11px] text-white/40 mt-1 leading-none">
                {entry.createdAt
                  ? `Checked in today at ${new Date(entry.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                  : 'Checked in today'}
              </p>
            </div>
          </motion.div>

          <div className="space-y-2">
            <MetricRow icon={MdEnergySavingsLeaf} label="Energy" value={entry.energyLevel} color="#f59e0b" />
            <MetricRow icon={FaCloudRain} label="Stress" value={entry.stressLevel} color="#f43f5e" />
            <MetricRow icon={IoMoonOutline} label="Sleep" value={entry.sleepQuality} color="#0ea5e9" />
          </div>
        </>
      ) : (
        <div className="text-center py-3">
          <p className="text-xs text-white/50 mb-3">You haven't checked in today</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCheckIn}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-primary/25 transition-colors"
          >
            Start Check-in <FaArrowRight className="w-2.5 h-2.5" />
          </motion.button>
        </div>
      )}

      <SidebarStats
        streak={analytics?.streaks?.current}
        weeklyAverage={weeklyAverage}
        totalCheckIns={analytics?.count}
      />

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/mood')}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 rounded-xl py-2.5 transition-colors"
      >
        View Mood Trends <FaArrowRight className="w-2.5 h-2.5" />
      </motion.button>
    </div>
  );
});

export default TodaysMoodCard;
