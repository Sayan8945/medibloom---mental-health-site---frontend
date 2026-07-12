import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import HubContent from './HubContent';

const SPRING = { type: 'spring', stiffness: 340, damping: 32, mass: 0.9 };

/**
 * Desktop/tablet sliding panel — slides in from the right over a blurred
 * backdrop (click outside to close), 380-420px wide. Framer Motion spring
 * transition, ~300-400ms feel. Rendered only at md+ (see index.jsx); the
 * <768px experience is the bottom-sheet in HubSheet.jsx instead.
 */
const HubPanel = (hub) => (
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
          className="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
        />
        <motion.aside
          key="panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={SPRING}
          role="dialog"
          aria-modal="true"
          aria-label="Wellness hub"
          className="hidden md:flex md:flex-col fixed top-0 right-0 h-full w-[380px] lg:w-[420px] z-[56]
            bg-gradient-to-b from-[#0e1122] via-[#0d1020] to-[#0a0c17]
            border-l border-emerald-400/10 shadow-2xl shadow-black/50"
        >
          {/* Ambient glow accents — soft green, calm, non-intrusive */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
            <h2 className="text-sm font-title font-bold text-white/90 flex items-center gap-2">
              Wellness Hub
            </h2>
            <button
              onClick={hub.close}
              aria-label="Close wellness hub"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-none"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex-1 overflow-y-auto scroll-thin px-5 pb-8">
            <HubContent {...hub} />
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

export default HubPanel;
