import { motion } from 'framer-motion';
import { MdLocalFireDepartment, MdShowChart, MdChecklist } from 'react-icons/md';

/**
 * Small streak / weekly-average / total-check-ins stat trio, shown inside
 * the sidebar's mood card. Pure presentational — values come from
 * GET /api/mood/analytics (streaks, weeklyAverages, count), no new APIs.
 */
const StatChip = ({ icon: Icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    whileHover={{ y: -2, scale: 1.03 }}
    className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-1.5 flex-1"
  >
    <Icon className="w-3.5 h-3.5 text-primary" />
    <span className="text-sm font-bold text-white tabular-nums leading-none">{value}</span>
    <span className="text-[9px] text-white/40 leading-none text-center">{label}</span>
  </motion.div>
);

const SidebarStats = ({ streak, weeklyAverage, totalCheckIns }) => (
  <div className="flex gap-2">
    <StatChip icon={MdLocalFireDepartment} value={streak ?? 0} label="Streak" delay={0} />
    <StatChip icon={MdShowChart} value={weeklyAverage ?? '—'} label="Weekly Avg" delay={0.05} />
    <StatChip icon={MdChecklist} value={totalCheckIns ?? 0} label="Check-ins" delay={0.1} />
  </div>
);

export default SidebarStats;
