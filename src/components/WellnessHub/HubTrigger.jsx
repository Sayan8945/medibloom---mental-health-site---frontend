import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronUp, IoPulseOutline } from 'react-icons/io5';
import { MdLocalFireDepartment } from 'react-icons/md';
import { useCountUp } from '../../hooks/useCountUp';

// ── Calm tiered color for the wellness score chip ────────────────
// Mirrors ScoreRing.jsx's tiers — soft green/gold/rose, never harsh.
const scoreColor = (pct) => {
  if (pct === null || pct === undefined) return 'text-white/50';
  if (pct >= 70) return 'text-emerald-300';
  if (pct >= 40) return 'text-amber-300';
  return 'text-rose-300';
};

/**
 * Edge-docked trigger tab — the sole entry point into the Wellness Hub.
 * Half-embedded in the screen edge (Arc/Notion panel-tab style) rather
 * than a floating circular FAB, and surfaces a live glance at the user's
 * stats (wellness score + streak on desktop, mood + score on mobile) so
 * the trigger itself doubles as a mini status readout. A soft pulsing
 * "vitals" glyph replaces any literal text label — reads as a calming
 * status cue rather than a UI instruction.
 *
 * Desktop (lg+): vertical pill docked to the right edge.
 * Tablet (md-lg): compact icon nub, bottom-right corner.
 * Mobile (<md): horizontal capsule docked to the bottom edge, centered
 * — sits in its own lane rather than stacking with the existing chat FAB.
 *
 * Breathing glow + periodic sweep are Framer `animate` loops (no CSS
 * keyframes) so they respect the app's prefers-reduced-motion handling.
 */
const HubTrigger = ({ isOpen, onClick, hasUnseenReminder, wellnessScore, streak, moodEmoji, showStats }) => {
  const [ripples, setRipples] = useState([]);
  const animatedScore = useCountUp(wellnessScore ?? 0, { duration: 900 });

  const handleClick = () => {
    const id = Date.now();
    setRipples((prev) => [...prev, id]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r !== id)), 600);
    onClick();
  };

  const scoreTextClass = scoreColor(wellnessScore);

  return (
    <>
      {/* ── Desktop (lg+) / Tablet (md-lg) — edge-docked vertical tab ── */}
      <div
        className="hidden md:block fixed z-[45] right-0
          md:bottom-[110px] md:top-auto
          lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto"
      >
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={isOpen ? 'Close wellness hub' : 'Open wellness hub'}
          aria-expanded={isOpen}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.96 }}
          transition={{ opacity: { duration: 0.4 }, x: { duration: 0.25, ease: 'easeOut' } }}
          className="group relative flex flex-col items-center overflow-hidden
            rounded-l-2xl rounded-r-none gap-2 py-3
            bg-gradient-to-b from-emerald-500/95 via-primary to-emerald-600/95
            border-2 border-emerald-200/40 border-r-0
            shadow-[0_4px_24px_-4px_rgba(6,160,85,0.5)]
            focus-visible:ring-2 focus-visible:ring-emerald-300 focus:outline-none
            w-11 md:h-11 md:flex-row md:justify-center md:py-0
            lg:w-10 lg:h-auto lg:min-h-[176px] lg:flex-col lg:justify-center"
        >
          {/* Breathing glow halo */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 bg-emerald-400/40 blur-md"
            animate={{ opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Periodic light sweep */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/25 to-white/0"
            initial={{ y: '-120%' }}
            animate={{ y: '120%' }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
          />

          {/* Unseen reminder dot */}
          {hasUnseenReminder && (
            <motion.span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-heroBg z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            />
          )}

          {/* Chevron — hidden on the tablet nub to leave room for the icon-ish feel; shown on the full desktop tab */}
          <motion.span
            className="relative z-10 text-white flex-shrink-0 lg:order-first"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <IoChevronBack className="w-3.5 h-3.5" />
          </motion.span>

          {/* Pulse glyph — replaces the old text label; reads as a calm
              "vitals" cue instead of a literal word, and gives the eye a
              small resting point above the live stats below it */}
          <motion.span
            className="hidden lg:block relative z-10 text-white/70"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IoPulseOutline className="w-4 h-4" />
          </motion.span>

          {/* Live stats — desktop tab only, rendered normally (not
              rotated) since the pill is wide enough for 2-3 char values */}
          {showStats && (
            <div className="hidden lg:flex relative z-10 flex-col items-center gap-1.5 pt-2 border-t border-emerald-200/25 w-7">
              <span className={`text-xs font-bold tabular-nums leading-none ${scoreTextClass}`}>
                {wellnessScore === null ? '—' : animatedScore}
              </span>
              {streak > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-200/90 leading-none">
                  <MdLocalFireDepartment className="w-3 h-3" />
                  {streak}
                </span>
              )}
            </div>
          )}

          {/* Click ripple */}
          <AnimatePresence>
            {ripples.map((id) => (
              <motion.span
                key={id}
                aria-hidden="true"
                className="absolute inset-0 bg-white/30 pointer-events-none"
                initial={{ scale: 0.3, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Mobile (<md) — bottom-edge capsule, horizontally centered ── */}
      <div
        className="md:hidden fixed z-[45] left-1/2 -translate-x-1/2
          bottom-[calc(env(safe-area-inset-bottom)+14px)]"
      >
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={isOpen ? 'Close wellness hub' : 'Open wellness hub'}
          aria-expanded={isOpen}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="group relative flex items-center gap-2.5 overflow-hidden
            rounded-full pl-3 pr-4 py-2.5
            bg-gradient-to-r from-emerald-500/95 via-primary to-emerald-600/95
            border-2 border-emerald-200/40
            shadow-[0_6px_24px_-4px_rgba(6,160,85,0.55)]
            focus-visible:ring-2 focus-visible:ring-emerald-300 focus:outline-none"
        >
          {/* Breathing glow */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 bg-emerald-400/40 blur-md rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Unseen reminder dot */}
          {hasUnseenReminder && (
            <motion.span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-heroBg z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            />
          )}

          {showStats ? (
            <>
              {moodEmoji && (
                <span className="relative z-10 text-base leading-none flex-shrink-0">{moodEmoji}</span>
              )}
              <span className={`relative z-10 text-sm font-bold tabular-nums leading-none ${scoreTextClass}`}>
                {wellnessScore === null ? '—' : animatedScore}
              </span>
              {streak > 0 && (
                <span className="relative z-10 flex items-center gap-0.5 text-xs font-semibold text-amber-200/90 leading-none">
                  <MdLocalFireDepartment className="w-3.5 h-3.5" />
                  {streak}
                </span>
              )}
            </>
          ) : (
            <motion.span
              className="relative z-10 text-white/80"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IoPulseOutline className="w-4 h-4" />
            </motion.span>
          )}

          <motion.span
            className="relative z-10 text-white/90 flex-shrink-0"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <IoChevronUp className="w-3.5 h-3.5" />
          </motion.span>

          {/* Click ripple */}
          <AnimatePresence>
            {ripples.map((id) => (
              <motion.span
                key={id}
                aria-hidden="true"
                className="absolute inset-0 bg-white/30 rounded-full pointer-events-none"
                initial={{ scale: 0.3, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default HubTrigger;
