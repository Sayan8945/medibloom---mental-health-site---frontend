import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdKeyboardArrowRight } from 'react-icons/md';
import UserMiniProfile from './UserMiniProfile';
import TodaysMoodCard from './TodaysMoodCard';
import QuickActions from './QuickActions';
import AIInsightCard from './AIInsightCard';
import MobileQuickLinksSheet from './MobileQuickLinksSheet';

/**
 * <768px layout — a stacked "profile drawer" of cards (no sticky
 * behavior, per spec). The full Quick Links list lives behind a bottom
 * sheet triggered by a single "Account & Settings" row, keeping the
 * stacked content short on small screens.
 */
const MobileSidebar = ({
  user, loading, entry, analytics, wellnessScores, aiInsight,
  onOpenCheckIn, onOpenProfile, onNavigate, onLinkAction, onQuickAction, onLogout,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="md:hidden bg-heroBg px-4 py-6 space-y-3"
      aria-label="Wellness overview"
    >
      <UserMiniProfile user={user} onOpenProfile={onOpenProfile} wellnessScores={wellnessScores} />

      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20">
        <TodaysMoodCard
          loading={loading}
          entry={entry}
          analytics={analytics}
          onOpenCheckIn={onOpenCheckIn}
        />
      </div>

      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/20">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1 mb-2">
          Quick Actions
        </p>
        <QuickActions onAction={onQuickAction} />
      </div>

      {aiInsight && <AIInsightCard insight={aiInsight} />}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSheetOpen(true)}
        className="w-full flex items-center justify-between gap-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl px-4 py-3.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
        aria-haspopup="dialog"
      >
        <span className="text-sm font-medium text-white/80">Account & Settings</span>
        <MdKeyboardArrowRight className="w-5 h-5 text-white/40" />
      </motion.button>

      <MobileQuickLinksSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onNavigate={(path) => { setSheetOpen(false); onNavigate(path); }}
        onAction={(action) => { setSheetOpen(false); onLinkAction(action); }}
        onLogout={() => { setSheetOpen(false); onLogout(); }}
      />
    </motion.section>
  );
};

export default MobileSidebar;
