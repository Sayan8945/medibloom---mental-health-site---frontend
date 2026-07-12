import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack } from 'react-icons/io5';
import { HiSparkles } from 'react-icons/hi2';

/**
 * Always-visible glowing trigger — the sole entry point into the Wellness
 * Hub now that the old persistent sidebar is gone. Position adapts per
 * breakpoint (right-center rail on desktop, bottom-right on tablet, bottom
 * nav area on mobile) via an outer positioning wrapper, while the inner
 * motion element owns the float/glow/pulse animation — kept separate so
 * Framer's animated `y` transform never fights with Tailwind's
 * `-translate-y-1/2` centering on desktop.
 *
 * Breathing glow + periodic pulse + floating drift are all built from
 * Framer Motion `animate` loops (no CSS keyframes needed) so they respect
 * the app's prefers-reduced-motion handling in index.css automatically.
 */
const HubTrigger = ({ isOpen, onClick, hasUnseenReminder }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = () => {
    const id = Date.now();
    setRipples((prev) => [...prev, id]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r !== id)), 600);
    onClick();
  };

  return (
    <div
      className={`
        fixed z-[45]

        /* Mobile & tablet — bottom-right area, stacked above the existing
           chat (bottom: 90px) + scroll-to-top (bottom: 32px) FABs so all
           three floating buttons stay visually distinct instead of
           overlapping. */
        right-4 bottom-[calc(env(safe-area-inset-bottom)+150px)] top-auto
        md:right-6 md:bottom-[150px] md:top-auto

        /* Desktop — right-center rail, per spec */
        lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:right-4
      `}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label={isOpen ? 'Close wellness hub' : 'Open wellness hub'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="group relative flex items-center justify-center w-12 h-12 lg:w-11 lg:h-11 rounded-full
          bg-gradient-to-br from-emerald-500/90 to-primary
          border border-emerald-300/30
          shadow-lg shadow-emerald-900/40
          focus-visible:ring-2 focus-visible:ring-emerald-300 focus:outline-none"
      >
        {/* Breathing glow halo */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-emerald-400/50 blur-md"
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.25, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Periodic pulse ring every few seconds */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-emerald-300/60"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.4, ease: 'easeOut' }}
        />

        {/* Unseen reminder dot */}
        {hasUnseenReminder && (
          <motion.span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-heroBg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          />
        )}

        {/* Arrow — rotates to point the other way when open */}
        <motion.span
          className="relative z-10 text-white"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <IoChevronBack className="w-5 h-5" />
        </motion.span>

        {/* Sparkle accent, mostly decorative — reinforces the "wellness" cue */}
        <HiSparkles className="absolute w-3 h-3 text-white/70 -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />

        {/* Click ripple */}
        <AnimatePresence>
          {ripples.map((id) => (
            <motion.span
              key={id}
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-white/40 pointer-events-none"
              initial={{ scale: 0.4, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default HubTrigger;
