import { motion } from 'framer-motion';
import { FaCircleArrowRight } from 'react-icons/fa6';
import { MdAutoAwesome } from 'react-icons/md';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import DesktopSidebar from '../components/WellnessSidebar/DesktopSidebar';
import { useWellnessSidebar } from '../components/WellnessSidebar/WellnessSidebarContext';

// ── Animation variants ─────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
});

const slideLeft = (delay = 0) => ({
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.45, ease: 'easeOut', delay } },
});

// ── Poem lines ─────────────────────────────────────────────────
const POEM_LINES = [
  { cap: 'S', rest: 'oothe your soul with calm and care,' },
  { cap: 'T', rest: 'ake each moment, breathe fresh air,' },
  { cap: 'A', rest: 'ccept yourself, let healing begin,' },
  { cap: 'R', rest: 'eflect within, find peace therein,' },
  { cap: 'T', rest: 'ogether we rise, strong from within.' },
];

// ── Floating soft orbs in bg ───────────────────────────────────
const Orb = ({ size, top, left, delay, color }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${color}`}
    style={{ width: size, height: size, top, left, filter: 'blur(60px)', opacity: 0.18 }}
    animate={{ y: [0, -14, 0], scale: [1, 1.08, 1] }}
    transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

// ── Tiny stat pill ─────────────────────────────────────────────
const StatPill = ({ value, label, delay }) => (
  <motion.div
    variants={fadeUp(delay)}
    initial="hidden"
    animate="visible"
    className="flex flex-col items-center bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3"
  >
    <span className="text-xl font-title font-bold text-primary leading-none">{value}</span>
    <span className="text-white/50 text-xs mt-1 font-medium">{label}</span>
  </motion.div>
);

// ── Main component ─────────────────────────────────────────────
// Desktop layout (lg+, signed-in users): Left Content 35% / Hero
// Illustration 40% / Wellness Sidebar 25%, via flex-basis percentages on a
// 3-item flex row. Signed-out users keep the original 50/50 two-column
// layout. Below `lg`, the sidebar renders in its own Tablet/Mobile layouts
// elsewhere on the page (see HomePage.jsx), so the hero itself falls back
// to the original 2-col stack.
const Home = () => {
  const sidebar = useWellnessSidebar();
  const { user } = sidebar;

  return (
  <section
    id="home"
    className="relative bg-heroBg text-white flex items-center pt-20 sm:pt-24 min-h-screen overflow-hidden"
  >
    {/* Ambient background orbs */}
    <Orb size={280} top="-40px"  left="-60px"  delay={0}   color="bg-primary" />
    <Orb size={200} top="40%"   left="45%"   delay={1.5} color="bg-violet-600" />
    <Orb size={160} top="70%"   left="-30px" delay={3}   color="bg-sky-500" />

    {/* Subtle grid texture */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />

    <div
      className={`relative max-w-[90rem] mx-auto w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 lg:px-12 py-10 md:py-14 gap-10 md:gap-10 ${
        user ? 'lg:items-start' : ''
      }`}
    >

      {/* ── LEFT COLUMN — 35% on desktop when the sidebar is present ── */}
      <div
        className={`w-full md:w-1/2 flex flex-col items-center md:items-start gap-5 md:gap-7 ${
          user ? 'lg:basis-[35%] lg:w-auto lg:shrink-0' : ''
        }`}
      >

        {/* Badge */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase"
        >
          <MdAutoAwesome className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          AI-Powered Mental Wellness
        </motion.div>

        {/* Heading */}
        <div className="text-center md:text-left w-full">
          <motion.h1
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-title font-bold leading-[1.1] tracking-tight"
          >
            Start Your Journey
            <br />
            <span className="relative inline-block mt-1">
              <motion.span
                className="relative z-10 text-primary"
                animate={{ textShadow: ['0 0 0px #06a055', '0 0 24px #06a05588', '0 0 0px #06a055'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                to Mental Wellness
              </motion.span>
              <motion.svg
                viewBox="0 0 280 10"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
              >
                <motion.path
                  d="M2 6 Q 70 2 140 6 Q 210 10 278 6"
                  stroke="#06a055"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </motion.h1>
        </div>

        {/* ── Poem block ── */}
        <motion.div
          variants={fadeUp(0.35)}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md"
        >
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b from-primary via-primary/50 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          />
          <div className="pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.25, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="block font-title text-5xl sm:text-6xl text-primary leading-none select-none -mb-1 sm:-mb-2"
            >
              "
            </motion.span>
            {POEM_LINES.map(({ cap, rest }, i) => (
              <motion.p
                key={i}
                variants={slideLeft(0.6 + i * 0.1)}
                initial="hidden"
                animate="visible"
                className="font-secondary italic text-xs sm:text-sm md:text-base leading-relaxed text-white/75"
              >
                <span className="text-xl sm:text-2xl md:text-3xl text-white font-bold not-italic">{cap}</span>
                {rest}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* ── Stat pills ── */}
        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center md:justify-start">
          <StatPill value="100+"  label="Students Helped"   delay={1.15} />
          <StatPill value="95%"   label="Satisfaction Rate" delay={1.25} />
          <StatPill value="Free"  label="Always"            delay={1.35} />
        </div>

        {/* ── CTA ── */}
        <motion.div
          variants={fadeUp(1.2)}
          initial="hidden"
          animate="visible"
          className="flex flex-col xs:flex-row gap-3 items-stretch xs:items-center md:items-start w-full xs:w-auto"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full xs:w-auto">
            <Link
              to="/survey"
              className="flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 text-white py-3.5 px-6 sm:px-8 font-semibold rounded-2xl transition-colors duration-200 shadow-xl shadow-primary/30 text-sm w-full xs:w-auto"
            >
              Take Assessment
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaCircleArrowRight className="text-base flex-shrink-0" />
              </motion.span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full xs:w-auto">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 border border-white/20 text-white/80 hover:text-white py-3.5 px-5 sm:px-6 font-medium rounded-2xl transition-all duration-200 text-sm backdrop-blur-sm w-full xs:w-auto"
            >
              Make Appointment
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── MIDDLE COLUMN — Hero Illustration — 40% on desktop when the
          sidebar is present, otherwise the original 50/50 split ── */}
      <motion.div
        initial={{ opacity: 0, x: 32, scale: 0.97 }}
        animate={{ opacity: 1, x: 0,  scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className={`w-full md:w-1/2 flex justify-center ${
          user ? 'lg:basis-[40%] lg:w-auto lg:shrink-0' : ''
        }`}
      >
        <ImageSlider />
      </motion.div>

      {/* ── RIGHT COLUMN — Wellness Sidebar — 25% on desktop, signed-in
          users only. Sticky (top = navbar height + 20px), never fixed, so
          it scrolls away naturally past the hero section. Rendered only
          at lg+ here; the Tablet/Mobile variants live in HomePage.jsx
          below the hero so there's exactly one mood widget per layout. ── */}
      {user && (
        <div className="hidden lg:block lg:basis-[25%] lg:shrink-0 self-stretch">
          <DesktopSidebar {...sidebar} />
        </div>
      )}

    </div>
  </section>
  );
};

export default Home;
