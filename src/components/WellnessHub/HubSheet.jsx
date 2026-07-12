import { motion, AnimatePresence } from 'framer-motion';
import HubContent from './HubContent';

const SPRING = { type: 'spring', stiffness: 340, damping: 32, mass: 0.9 };
const CLOSE_DRAG_THRESHOLD = 120; // px dragged down before it counts as "swipe to close"

/**
 * <768px bottom-sheet variant — slides up from the bottom instead of in
 * from the right. Supports swipe-down-to-close via Framer Motion's drag
 * gesture (vertical axis only, snaps back if the drag doesn't clear the
 * threshold).
 */
const HubSheet = (hub) => (
  <AnimatePresence>
    {hub.isOpen && (
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={hub.close}
          aria-hidden="true"
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
        />
        <motion.div
          key="sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={SPRING}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.4 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > CLOSE_DRAG_THRESHOLD) hub.close();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Wellness hub"
          className="md:hidden fixed bottom-0 left-0 right-0 z-[56] max-h-[88vh] flex flex-col
            bg-gradient-to-b from-[#0e1122] via-[#0d1020] to-[#0a0c17]
            border-t border-emerald-400/10 rounded-t-3xl shadow-2xl shadow-black/50"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-16 right-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" />

          {/* Drag handle */}
          <div className="relative flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1.5 rounded-full bg-white/20" />
          </div>

          <div className="relative flex items-center justify-between px-5 pt-1 pb-3 flex-shrink-0">
            <h2 className="text-sm font-title font-bold text-white/90">Wellness Hub</h2>
            <button
              onClick={hub.close}
              aria-label="Close wellness hub"
              className="text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="relative flex-1 overflow-y-auto scroll-thin px-5 pb-8">
            <HubContent {...hub} />
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default HubSheet;
