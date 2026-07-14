/**
 * Wellness scoring — shared by StepResults and SurveyHistoryPage so the
 * two views never drift apart.
 *
 * IMPORTANT: This mirrors Backend/utils/scoring.js exactly. The two live
 * in separate repos (no shared package), so any change here must be
 * ported to the backend copy by hand, and vice versa.
 */

const avg = (vals) => {
  const clean = vals.filter((v) => v !== null && v !== undefined && !isNaN(v));
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : null;
};

const invert = (score, max = 4) =>
  score === null || score === undefined ? null : max - score;

const toPercent = (score, max = 4) =>
  score === null || score === undefined ? 50 : Math.round((score / max) * 100);

/**
 * Compute the six dimension scores + overall from a survey response.
 * @param {Object} r  A survey response (answers or a stored document)
 * @returns {{emotional,anxiety,depression,social,stress,lifestyle,overall}|null}
 */
export const computeScores = (r) => {
  if (!r) return null;
  const em = r.emotional  || {};
  const a  = r.anxiety    || {};
  const d  = r.depression || {};
  const so = r.social     || {};
  const l  = r.lifestyle  || {};
  const s  = r.stress     || {};

  const emotionalRaw = avg([
    em.happiness, em.motivation, em.hopefulness, em.emotionalStability,
    invert(em.loneliness), invert(em.irritability), invert(em.moodChanges),
  ]);
  const anxietyRaw = avg([
    a.nervousWithoutReason, a.excessiveWorry, a.difficultyRelaxing,
    a.racingThoughts, a.avoidanceBehavior, a.frequentTension,
  ]);
  const depressionRaw = avg([
    d.lostInterest, d.fatigue, d.concentrationIssues,
    d.feelHopeless, d.feelWorthless, d.difficultyGettingUp, d.emotionallyNumb,
  ]);
  const socialRaw = avg([
    so.familySupport, so.friendSupport, so.socialInteraction,
    so.expressEmotions, so.senseOfBelonging, so.communityInvolvement,
  ]);
  const stressRaw = avg([
    s.workStressLevel, s.deadlineStruggle, s.feelOverwhelmed,
    invert(s.enjoyWork), s.experienceBurnout,
  ]);
  const lifestyleScore = l.sleepQuality && l.waterIntake
    ? ((l.sleepQuality / 5) * 0.4 + (Math.min(l.waterIntake, 10) / 10) * 0.3 +
       (l.outdoorActivity / 7) * 0.3) * 100
    : 50;

  const emotional  = toPercent(emotionalRaw);
  const anxiety    = toPercent(invert(anxietyRaw));
  const depression = toPercent(invert(depressionRaw));
  const social      = toPercent(socialRaw);
  const stress      = toPercent(invert(stressRaw));
  const lifestyle   = Math.round(lifestyleScore);
  const overall     = Math.round((emotional + anxiety + depression + social + stress + lifestyle) / 6);

  return { emotional, anxiety, depression, social, stress, lifestyle, overall };
};

/** Shared colour/label tier for a 0-100 score. */
export const scoreColor = (pct) => {
  if (pct >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700', label: 'Good' };
  if (pct >= 45) return { bar: 'bg-amber-400',   text: 'text-amber-600',   badge: 'bg-amber-50 text-amber-700',     label: 'Fair' };
  return              { bar: 'bg-rose-500',       text: 'text-rose-600',    badge: 'bg-rose-50 text-rose-700',       label: 'Needs Attention' };
};
