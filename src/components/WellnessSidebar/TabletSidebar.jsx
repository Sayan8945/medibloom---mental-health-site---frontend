import { motion } from 'framer-motion';
import UserMiniProfile from './UserMiniProfile';
import TodaysMoodCard from './TodaysMoodCard';
import QuickActions from './QuickActions';
import AIInsightCard from './AIInsightCard';

/**
 * md-only (768px-1023px) layout — the sidebar drops below the hero section
 * and re-flows into a horizontal 2-column card grid instead of a vertical
 * rail. Quick Links are intentionally omitted here per the tablet spec
 * ("collapse some stats") — they remain reachable via the navbar's profile
 * dropdown, avoiding a duplicate long list at this breakpoint.
 */
const TabletSidebar = ({
  user, loading, entry, analytics, wellnessScores, aiInsight,
  onOpenCheckIn, onOpenProfile, onQuickAction,
}) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="hidden md:block lg:hidden bg-heroBg px-4 sm:px-6 py-8"
    aria-label="Wellness overview"
  >
    <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <UserMiniProfile user={user} onOpenProfile={onOpenProfile} wellnessScores={wellnessScores} />
      </div>

      <div className="col-span-2 md:col-span-1">
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 h-full">
          <TodaysMoodCard
            loading={loading}
            entry={entry}
            analytics={analytics}
            onOpenCheckIn={onOpenCheckIn}
          />
        </div>
      </div>

      <div className="col-span-2 md:col-span-1">
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20 h-full">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1 mb-2">
            Quick Actions
          </p>
          <QuickActions onAction={onQuickAction} />
        </div>
      </div>

      {aiInsight && (
        <div className="col-span-2">
          <AIInsightCard insight={aiInsight} />
        </div>
      )}
    </div>
  </motion.section>
);

export default TabletSidebar;
