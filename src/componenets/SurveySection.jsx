import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MdLock,
  MdAutoAwesome,
  MdPersonPin,
  MdTimer,
  MdTrendingUp,
  MdCardGiftcard,
} from 'react-icons/md';
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';

// ── Benefit cards data ────────────────────────────
const BENEFITS = [
  {
    icon: MdLock,
    title: '100% Confidential',
    desc: 'Your responses are encrypted and never shared with third parties.',
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon: MdAutoAwesome,
    title: 'AI-Powered Insights',
    desc: 'Advanced AI analyses your answers to surface meaningful patterns.',
    color: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-500',
  },
  {
    icon: MdPersonPin,
    title: 'Personalised Report',
    desc: 'Receive a wellness report tailored specifically to your responses.',
    color: 'from-sky-500/20 to-blue-500/10',
    iconColor: 'text-sky-500',
  },
  {
    icon: MdTimer,
    title: 'Only 3–5 Minutes',
    desc: 'A concise set of questions designed to respect your time.',
    color: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: MdTrendingUp,
    title: 'Track Your Progress',
    desc: 'Retake the assessment over time to chart your wellness journey.',
    color: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-500',
  },
  {
    icon: MdCardGiftcard,
    title: 'Completely Free',
    desc: 'Full assessment and personalised report — no cost, no hidden fees.',
    color: 'from-lime-500/20 to-green-500/10',
    iconColor: 'text-lime-600',
  },
];

// ── Process steps ─────────────────────────────────
const PROCESS_STEPS = [
  { number: '01', label: 'Answer Questions' },
  { number: '02', label: 'AI Analysis' },
  { number: '03', label: 'Wellness Report' },
  { number: '04', label: 'Track Progress' },
];

// ── Floating abstract shapes (pure CSS/motion) ────
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    animate={{ y: [0, -18, 0], scale: [1, 1.06, 1] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

// ── Benefit card ──────────────────────────────────
const BenefitCard = ({ benefit, index }) => {
  const Icon = benefit.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* gradient bg on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
      />
      <div className="relative">
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-white/80 transition-colors duration-300 shadow-sm">
          <Icon className={`w-6 h-6 ${benefit.iconColor}`} />
        </div>
        <h3 className="text-base font-semibold text-heroBg mb-2 leading-snug">{benefit.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
      </div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────
const SurveySection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const howRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  const scrollToHow = () => {
    howRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section
      ref={sectionRef}
      id="survey"
      className="relative bg-heroBg overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* ── Ambient orbs ── */}
      <FloatingOrb className="w-96 h-96 bg-primary top-[-80px] left-[-80px]" delay={0} />
      <FloatingOrb className="w-72 h-72 bg-violet-500 bottom-0 right-[-60px]" delay={1.5} />
      <FloatingOrb className="w-56 h-56 bg-sky-400 top-1/2 left-1/3" delay={3} />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <MdAutoAwesome className="w-3.5 h-3.5" />
            AI-Powered Assessment
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-title font-bold text-white mb-6 leading-tight tracking-tight">
            Take Your{' '}
            <span className="relative inline-block">
              <span className="text-primary">Mental Wellness</span>
              {/* underline squiggle */}
              <motion.svg
                viewBox="0 0 220 8"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              >
                <motion.path
                  d="M2 5 Q 55 1 110 5 Q 165 9 218 5"
                  stroke="#06a055"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>{' '}
            Assessment
          </h2>

          <p className="text-white/60 text-lg md:w-3/5 mx-auto leading-relaxed">
            Answer a few confidential questions and receive a personalised mental wellness report
            powered by AI. Your responses help us provide tailored insights and improve future
            assessments.
          </p>
        </motion.div>

        {/* ── Benefit cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={i} />
          ))}
        </div>

        {/* ── CTA block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-10"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/survey')}
            className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary/30 transition-colors duration-200 text-base"
          >
            Start Assessment
            <motion.span
              className="inline-flex"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToHow}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-medium px-8 py-4 rounded-2xl transition-colors duration-200 text-base"
          >
            Learn More
            <FaChevronDown className="w-3.5 h-3.5 opacity-70" />
          </motion.button>
        </motion.div>

        {/* ── Privacy notice ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-start sm:items-center justify-center gap-2 text-white/40 text-xs text-center max-w-lg mx-auto mb-20"
        >
          <IoShieldCheckmark className="w-4 h-4 flex-shrink-0 text-primary/60 mt-0.5 sm:mt-0" />
          <span>
            Your survey responses remain private and secure. This assessment is intended for
            mental wellness screening and does not provide a medical diagnosis.
          </span>
        </motion.div>

        {/* ── How it works — process strip ── */}
        <div ref={howRef}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center text-white/40 text-xs font-semibold uppercase tracking-widest mb-8"
          >
            How it works
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.number} className="flex flex-col sm:flex-row items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                  className="flex flex-col items-center group"
                >
                  {/* Step circle */}
                  <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-200">
                    <span className="text-primary font-title font-bold text-sm">{step.number}</span>
                    {/* completed glow for step 1 */}
                    {i === 0 && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </div>
                  <span className="text-white/60 text-xs text-center font-medium max-w-[80px] leading-snug">
                    {step.label}
                  </span>
                </motion.div>

                {/* Connector line — horizontal on sm+, vertical on mobile */}
                {i < PROCESS_STEPS.length - 1 && (
                  <>
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 + 0.15 }}
                      className="hidden sm:block w-16 lg:w-24 h-px bg-gradient-to-r from-white/20 to-white/5 mx-2 origin-left mb-8"
                    />
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.15 }}
                      className="sm:hidden w-px h-6 bg-gradient-to-b from-white/20 to-white/5 my-1 origin-top"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SurveySection;
