import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FREQUENCY_OPTIONS } from '../data/surveySteps';
import { MdAutoAwesome, MdRefresh } from 'react-icons/md';
import { IoShieldCheckmark } from 'react-icons/io5';

// Simple scoring helpers — numeric averages from raw answers
const avg = (vals) => {
  const clean = vals.filter((v) => v !== null && v !== undefined);
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : null;
};

// Invert score (higher raw = worse, flip to wellness scale)
const invert = (score, max = 4) => (score === null ? null : max - score);

const toPercent = (score, max = 4) =>
  score === null ? 50 : Math.round((score / max) * 100);

const SCORE_COLOR = (pct) => {
  if (pct >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Good' };
  if (pct >= 45) return { bar: 'bg-amber-400',   text: 'text-amber-600',   label: 'Fair' };
  return            { bar: 'bg-rose-500',         text: 'text-rose-600',    label: 'Needs Attention' };
};

const ScoreBar = ({ label, pct, delay }) => {
  const { bar, text, label: badge } = SCORE_COLOR(pct);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="space-y-1.5"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 ${text}`}>
          {badge}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
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

const StepResults = ({ answers, onReset }) => {
  const navigate = useNavigate();

  const scores = useMemo(() => {
    const { emotional: em, anxiety: a, depression: d, social: so, lifestyle: l, stress: s } = answers;

    const emotionalRaw = avg([em.happiness, em.motivation, em.hopefulness, em.emotionalStability,
      invert(em.loneliness), invert(em.irritability), invert(em.moodChanges)]);
    const anxietyRaw   = avg([a.nervousWithoutReason, a.excessiveWorry, a.difficultyRelaxing,
      a.racingThoughts, a.avoidanceBehavior, a.frequentTension]);
    const depressionRaw= avg([d.lostInterest, d.fatigue, d.concentrationIssues,
      d.feelHopeless, d.feelWorthless, d.difficultyGettingUp, d.emotionallyNumb]);
    const socialRaw    = avg([so.familySupport, so.friendSupport, so.socialInteraction,
      so.expressEmotions, so.senseOfBelonging, so.communityInvolvement]);
    const stressRaw    = avg([s.workStressLevel, s.deadlineStruggle, s.feelOverwhelmed,
      invert(s.enjoyWork), s.experienceBurnout]);

    // lifestyle (higher = better)
    const lifestyleScore = l.sleepQuality && l.waterIntake
      ? ((l.sleepQuality / 5) * 0.4 + (Math.min(l.waterIntake, 10) / 10) * 0.3 +
         (l.outdoorActivity / 7) * 0.3) * 100
      : 50;

    return {
      emotional:  toPercent(emotionalRaw),
      anxiety:    toPercent(invert(anxietyRaw)),      // invert — lower anxiety = better
      depression: toPercent(invert(depressionRaw)),   // invert — lower score = better
      social:     toPercent(socialRaw),
      stress:     toPercent(invert(stressRaw)),       // invert — lower stress = better
      lifestyle:  Math.round(lifestyleScore),
    };
  }, [answers]);

  const overall = Math.round(
    (scores.emotional + scores.anxiety + scores.depression +
     scores.social + scores.stress + scores.lifestyle) / 6
  );

  const { text: overallText, label: overallLabel } = SCORE_COLOR(overall);

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
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-heroBg">
          Your Wellness Report
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          Based on your responses, here's a snapshot of your current mental wellness.
        </p>
      </motion.div>

      {/* Overall score ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3"
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Overall Wellness Score</p>
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="#06a055"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overall / 100) }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-heroBg"
            >
              {overall}
            </motion.span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 ${overallText}`}>
          {overallLabel}
        </span>
      </motion.div>

      {/* Dimension scores */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-semibold text-heroBg">Wellness Dimensions</h3>
        <ScoreBar label="Emotional Wellbeing"  pct={scores.emotional}  delay={0.15} />
        <ScoreBar label="Anxiety Management"   pct={scores.anxiety}    delay={0.2}  />
        <ScoreBar label="Mood & Energy"         pct={scores.depression} delay={0.25} />
        <ScoreBar label="Social Wellbeing"      pct={scores.social}     delay={0.3}  />
        <ScoreBar label="Stress Resilience"     pct={scores.stress}     delay={0.35} />
        <ScoreBar label="Lifestyle Score"       pct={scores.lifestyle}  delay={0.4}  />
      </div>

      {/* Personalised note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-2"
      >
        <p className="text-sm font-semibold text-heroBg">💡 Next Steps</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {overall >= 70
            ? "You're doing well overall. Keep nurturing your healthy habits and continue checking in with yourself regularly."
            : overall >= 45
            ? "There are some areas worth giving more attention to. Small, consistent improvements in sleep, social connection, or stress management can make a meaningful difference."
            : "Some of your responses suggest you may benefit from additional support. Please consider talking to a trusted person or a qualified mental health professional. You don't have to navigate this alone."}
        </p>
      </motion.div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
        <IoShieldCheckmark className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
        <p>
          This report is for wellness screening purposes only and does not constitute a medical diagnosis.
          If you are experiencing severe distress, please seek support from a qualified mental health professional.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-primary/20"
        >
          Return to Home
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <MdRefresh className="w-4 h-4" />
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

export default StepResults;
