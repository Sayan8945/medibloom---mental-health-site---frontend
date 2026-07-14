import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdAutoAwesome, MdRefresh, MdInsights, MdTrendingUp, MdTrendingFlat } from 'react-icons/md';
import { IoShieldCheckmark, IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { computeScores, scoreColor as SCORE_COLOR } from '../../utils/wellnessScoring';

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

// ── Score bar with optional delta vs previous ───────────────────
const ScoreBar = ({ label, pct, prev, delay }) => {
  const { bar, text, label: badge } = SCORE_COLOR(pct);
  const delta = prev !== null && prev !== undefined ? pct - prev : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="space-y-1.5"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
          {delta !== null && delta !== 0 && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              delta > 0 ? 'text-emerald-600' : 'text-rose-500'
            }`}>
              {delta > 0 ? <IoArrowUp className="w-3 h-3" /> : <IoArrowDown className="w-3 h-3" />}
              {Math.abs(delta)}
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 ${text}`}>
            {badge}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

const StepResults = ({ answers, previousResponse, onReset }) => {
  const navigate = useNavigate();

  const scores     = useMemo(() => computeScores(answers), [answers]);
  const prevScores = useMemo(() => computeScores(previousResponse), [previousResponse]);

  const overall = scores.overall;
  const { text: overallText, label: overallLabel } = SCORE_COLOR(overall);

  const overallDelta = prevScores ? overall - prevScores.overall : null;

  const DIMS = [
    { key: 'emotional',  label: 'Emotional Wellbeing' },
    { key: 'anxiety',    label: 'Anxiety Management' },
    { key: 'depression', label: 'Mood & Energy' },
    { key: 'social',     label: 'Social Wellbeing' },
    { key: 'stress',     label: 'Stress Resilience' },
    { key: 'lifestyle',  label: 'Lifestyle Score' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <MdAutoAwesome className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-heroBg dark:text-white">
          Your Wellness Report
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
          Based on your responses, here's a snapshot of your current mental wellness.
        </p>
      </motion.div>

      {/* Overall score ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 flex flex-col items-center gap-3"
      >
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Overall Wellness Score</p>
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" className="dark:[stroke:rgba(255,255,255,0.1)]" strokeWidth="10" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none" stroke="#06a055" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overall / 100) }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-heroBg dark:text-white"
            >
              {overall}
            </motion.span>
            <span className="text-xs text-gray-400 dark:text-gray-500">/100</span>
          </div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 ${overallText}`}>
          {overallLabel}
        </span>

        {/* Overall delta vs previous */}
        {overallDelta !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`flex items-center gap-1.5 text-sm font-medium ${
              overallDelta > 0 ? 'text-emerald-600' : overallDelta < 0 ? 'text-rose-500' : 'text-gray-500'
            }`}
          >
            {overallDelta > 0 ? <MdTrendingUp className="w-4 h-4" />
              : overallDelta < 0 ? <IoArrowDown className="w-4 h-4" />
              : <MdTrendingFlat className="w-4 h-4" />}
            {overallDelta === 0
              ? 'Same as your last assessment'
              : `${overallDelta > 0 ? '+' : ''}${overallDelta} vs previous (${prevScores.overall})`}
          </motion.div>
        )}
      </motion.div>

      {/* Comparison summary card (only when a previous assessment exists) */}
      {prevScores && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-heroBg dark:text-white">Compared to Last Assessment</h3>
            <span className="text-xs text-gray-400 dark:text-gray-500">{fmtDate(previousResponse?.submittedAt || previousResponse?.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Here's how each area changed since you last checked in.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DIMS.map(({ key, label }) => {
              const cur = scores[key];
              const pv  = prevScores[key];
              const d   = cur - pv;
              const good = d > 0, bad = d < 0;
              return (
                <div key={key} className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 leading-tight">{label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-heroBg dark:text-white">{cur}</span>
                    <span className={`text-[11px] font-semibold ${
                      good ? 'text-emerald-600' : bad ? 'text-rose-500' : 'text-gray-400'
                    }`}>
                      {d === 0 ? '±0' : `${d > 0 ? '+' : ''}${d}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Dimension scores (with delta arrows if previous exists) */}
      <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-semibold text-heroBg dark:text-white">Wellness Dimensions</h3>
        {DIMS.map(({ key, label }, i) => (
          <ScoreBar
            key={key}
            label={label}
            pct={scores[key]}
            prev={prevScores ? prevScores[key] : null}
            delay={0.15 + i * 0.05}
          />
        ))}
      </div>

      {/* Personalised note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-5 space-y-2"
      >
        <p className="text-sm font-semibold text-heroBg dark:text-white">💡 Next Steps</p>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {overall >= 70
            ? "You're doing well overall. Keep nurturing your healthy habits and continue checking in with yourself regularly."
            : overall >= 45
            ? "There are some areas worth giving more attention to. Small, consistent improvements in sleep, social connection, or stress management can make a meaningful difference."
            : "Some of your responses suggest you may benefit from additional support. Please consider talking to a trusted person or a qualified mental health professional. You don't have to navigate this alone."}
        </p>
      </motion.div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        <IoShieldCheckmark className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
        <p>
          This report is for wellness screening purposes only and does not constitute a medical diagnosis.
          If you are experiencing severe distress, please seek support from a qualified mental health professional.
        </p>
      </div>

      {/* Primary CTA — Wellness Journey */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/analytics')}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-2xl text-sm shadow-lg shadow-primary/25 transition-colors"
      >
        <MdInsights className="w-5 h-5" />
        View Your Wellness Journey
      </motion.button>

      {/* Secondary actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/history')}
          className="flex-1 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-sm transition-colors"
        >
          View All History
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <MdRefresh className="w-4 h-4" />
          Retake Assessment
        </button>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full text-center text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors pt-1"
      >
        Return to Home
      </button>
    </div>
  );
};

export default StepResults;
