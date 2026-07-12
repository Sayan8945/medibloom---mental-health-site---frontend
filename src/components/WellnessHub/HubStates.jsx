import { motion } from 'framer-motion';
import { IoCloudOfflineOutline, IoWarningOutline, IoRefresh } from 'react-icons/io5';

/**
 * Loading skeleton — mirrors the shape of the real hub content
 * (profile header + mood card + quick actions) so there's no layout jump
 * once data arrives.
 */
export const HubSkeleton = () => (
  <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading your wellness data">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-2.5 bg-white/10 rounded w-1/3" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-2xl flex-1" />)}
    </div>
    <div className="h-28 bg-white/5 rounded-2xl" />
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
    </div>
  </div>
);

/**
 * Error state — shown when the hub's data fetch fails for a reason other
 * than session expiration (network error, 500, etc). Offers a retry that
 * re-runs the same load function, no new logic introduced.
 */
export const HubError = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center gap-3 py-10 px-2"
  >
    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
      <IoWarningOutline className="w-6 h-6 text-rose-300" />
    </div>
    <p className="text-sm text-white/60 leading-relaxed max-w-[220px]">
      {message || 'Something went wrong loading your wellness data.'}
    </p>
    <button
      onClick={onRetry}
      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-400/20 rounded-xl px-4 py-2 transition-colors"
    >
      <IoRefresh className="w-3.5 h-3.5" />
      Try Again
    </button>
  </motion.div>
);

/**
 * Offline banner — sits above the hub content, doesn't block it, so users
 * can still see the last-loaded data while offline.
 */
export const OfflineBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3.5 py-2.5 text-amber-200/90 text-xs font-medium"
  >
    <IoCloudOfflineOutline className="w-4 h-4 flex-shrink-0" />
    You're offline — showing your last synced data.
  </motion.div>
);
