import { motion } from 'framer-motion';
import UserMiniProfile from './UserMiniProfile';
import TodaysMoodCard from './TodaysMoodCard';
import ProfileQuickLinks from './ProfileQuickLinks';
import QuickActions from './QuickActions';
import AIInsightCard from './AIInsightCard';

/**
 * lg+ sticky wellness sidebar — the 3rd column of the hero grid (see
 * Home.jsx). `top-[116px]` = navbar height (~96px, matches the `pt-24`
 * convention used across AnalyticsPage/MoodPage/RecommendationsPage) + the
 * requested 20px breathing room. Intentionally `position: sticky`, never
 * `fixed`, so it scrolls away naturally once the hero section ends.
 */
const DesktopSidebar = ({
  user, loading, entry, analytics, wellnessScores, aiInsight,
  onOpenCheckIn, onOpenProfile, onNavigate, onLinkAction, onQuickAction, onLogout,
}) => (
  <motion.aside
    initial={{ opacity: 0, x: 24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    className="hidden lg:flex lg:flex-col w-full lg:sticky lg:top-[116px] lg:max-h-[calc(100vh-136px)]"
    aria-label="Wellness sidebar"
  >
    <div className="relative flex flex-col gap-4 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4 xl:p-5 shadow-2xl shadow-black/20 overflow-y-auto scroll-thin max-h-full">
      {/* Subtle gradient overlay for the glassmorphism feel */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-violet-500/5" />

      <div className="relative">
        <UserMiniProfile user={user} onOpenProfile={onOpenProfile} wellnessScores={wellnessScores} />
      </div>

      <div className="relative">
        <TodaysMoodCard
          loading={loading}
          entry={entry}
          analytics={analytics}
          onOpenCheckIn={onOpenCheckIn}
        />
      </div>

      <div className="relative border-t border-white/10 pt-3">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3.5 mb-1">
          Quick Links
        </p>
        <ProfileQuickLinks onNavigate={onNavigate} onAction={onLinkAction} onLogout={onLogout} />
      </div>

      <div className="relative border-t border-white/10 pt-3">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1 mb-2">
          Quick Actions
        </p>
        <QuickActions onAction={onQuickAction} />
      </div>

      {aiInsight && (
        <div className="relative">
          <AIInsightCard insight={aiInsight} />
        </div>
      )}
    </div>
  </motion.aside>
);

export default DesktopSidebar;
