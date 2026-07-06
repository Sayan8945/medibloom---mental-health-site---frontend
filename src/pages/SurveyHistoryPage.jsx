import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { MdHistory, MdAutoAwesome, MdRefresh } from 'react-icons/md';
import { IoArrowBack, IoShieldCheckmark, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { FaArrowRight } from 'react-icons/fa';

// ── Scoring (same logic as StepResults) ───────────────────────
const avg = (vals) => {
  const clean = vals.filter((v) => v !== null && v !== undefined && !isNaN(v));
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : null;
};
const invert = (score, max = 4) => (score === null || score === undefined ? null : max - score);
const toPercent = (score, max = 4) =>
  score === null || score === undefined ? 50 : Math.round((score / max) * 100);

const computeScores = (r) => {
  const em = r.emotional || {};
  const a  = r.anxiety   || {};
  const d  = r.depression|| {};
  const so = r.social    || {};
  const l  = r.lifestyle || {};
  const s  = r.stress    || {};

  const emotionalRaw  = avg([em.happiness, em.motivation, em.hopefulness, em.emotionalStability,
    invert(em.loneliness), invert(em.irritability), invert(em.moodChanges)]);
  const anxietyRaw    = avg([a.nervousWithoutReason, a.excessiveWorry, a.difficultyRelaxing,
    a.racingThoughts, a.avoidanceBehavior, a.frequentTension]);
  const depressionRaw = avg([d.lostInterest, d.fatigue, d.concentrationIssues,
    d.feelHopeless, d.feelWorthless, d.difficultyGettingUp, d.emotionallyNumb]);
  const socialRaw     = avg([so.familySupport, so.friendSupport, so.socialInteraction,
    so.expressEmotions, so.senseOfBelonging, so.communityInvolvement]);
  const stressRaw     = avg([s.workStressLevel, s.deadlineStruggle, s.feelOverwhelmed,
    invert(s.enjoyWork), s.experienceBurnout]);
  const lifestyleScore = l.sleepQuality && l.waterIntake
    ? ((l.sleepQuality / 5) * 0.4 + (Math.min(l.waterIntake, 10) / 10) * 0.3 +
       (l.outdoorActivity / 7) * 0.3) * 100
    : 50;

  const emotional  = toPercent(emotionalRaw);
  const anxiety    = toPercent(invert(anxietyRaw));
  const depression = toPercent(invert(depressionRaw));
  const social     = toPercent(socialRaw);
  const stress     = toPercent(invert(stressRaw));
  const lifestyle  = Math.round(lifestyleScore);
  const overall    = Math.round((emotional + anxiety + depression + social + stress + lifestyle) / 6);

  return { emotional, anxiety, depression, social, stress, lifestyle, overall };
};

// ── Helpers ────────────────────────────────────────────────────
const scoreColor = (pct) => {
  if (pct >= 70) return { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', label: 'Good' };
  if (pct >= 45) return { bar: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700',     label: 'Fair' };
  return            { bar: 'bg-rose-500',         badge: 'bg-rose-50 text-rose-700',       label: 'Low' };
};

const ringColor = (pct) => {
  if (pct >= 70) return '#10b981';
  if (pct >= 45) return '#f59e0b';
  return '#f43f5e';
};

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// ── Mini score bar ─────────────────────────────────────────────
const MiniBar = ({ label, pct }) => {
  const { bar, badge, label: tag } = scoreColor(pct);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">{label}</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge}`}>{tag}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ── Score ring (SVG) ───────────────────────────────────────────
const ScoreRing = ({ pct, size = 64 }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
        <motion.circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke={ringColor(pct)}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-heroBg leading-none">{pct}</span>
        <span className="text-[9px] text-gray-400">/100</span>
      </div>
    </div>
  );
};

// ── Submission card ────────────────────────────────────────────
const SubmissionCard = ({ response, index }) => {
  const [expanded, setExpanded] = useState(false);
  const scores = computeScores(response);
  const { label: overallLabel, badge: overallBadge } = scoreColor(scores.overall);

  const DIMS = [
    { label: 'Emotional',  pct: scores.emotional  },
    { label: 'Anxiety',    pct: scores.anxiety    },
    { label: 'Mood',       pct: scores.depression },
    { label: 'Social',     pct: scores.social     },
    { label: 'Stress',     pct: scores.stress     },
    { label: 'Lifestyle',  pct: scores.lifestyle  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center gap-4 px-5 py-4">
        <ScoreRing pct={scores.overall} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-heroBg">Assessment #{index + 1}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${overallBadge}`}>
              {overallLabel}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Submitted on {fmt(response.submittedAt || response.createdAt)}
          </p>
          {response.basicInfo?.age && (
            <p className="text-xs text-gray-400 mt-0.5">
              Age {response.basicInfo.age}
              {response.basicInfo.occupation ? ` · ${response.basicInfo.occupation}` : ''}
            </p>
          )}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
        >
          {expanded ? <IoChevronUp className="w-4 h-4" /> : <IoChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable dimension breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-50 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">
                Dimension Breakdown
              </p>
              {DIMS.map(({ label, pct }) => (
                <MiniBar key={label} label={label} pct={pct} />
              ))}

              {/* Coping habits */}
              {response.coping?.selectedHabits?.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Coping Habits Used
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {response.coping.selectedHabits.map((h) => (
                      <span key={h} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Empty state ────────────────────────────────────────────────
const EmptyState = ({ onTake }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center gap-5 py-16"
  >
    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
      <MdHistory className="w-10 h-10 text-primary/60" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-heroBg">No assessments yet</h3>
      <p className="text-gray-500 text-sm max-w-xs">
        Complete your first wellness assessment to start tracking your mental health journey.
      </p>
    </div>
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onTake}
      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-2xl text-sm shadow-md shadow-primary/25 transition-colors"
    >
      Take Assessment
      <FaArrowRight className="w-3.5 h-3.5" />
    </motion.button>
  </motion.div>
);

// ── Main page ──────────────────────────────────────────────────
const SurveyHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    api.get('/survey/history')
      .then((res) => setResponses(res.data.responses || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] font-primary pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium mb-5 transition-colors"
          >
            <IoArrowBack className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MdHistory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-title font-bold text-heroBg leading-none">
                Survey History
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {user?.fullName} · {responses.length} assessment{responses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          /* Skeleton */
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 text-sm text-center">
            {error}
          </div>
        ) : responses.length === 0 ? (
          <EmptyState onTake={() => navigate('/survey')} />
        ) : (
          <div className="space-y-4">
            {responses.map((r, i) => (
              <SubmissionCard key={r._id} response={r} index={i} />
            ))}

            {/* Take another CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: responses.length * 0.07 + 0.2 }}
              className="flex justify-center pt-4"
            >
              <button
                onClick={() => navigate('/survey')}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                <MdAutoAwesome className="w-4 h-4" />
                Take a new assessment
              </button>
            </motion.div>
          </div>
        )}

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed mt-8"
        >
          <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 mt-0.5" />
          These scores are for wellness screening only and do not constitute a medical diagnosis.
        </motion.p>
      </div>
    </div>
  );
};

export default SurveyHistoryPage;
