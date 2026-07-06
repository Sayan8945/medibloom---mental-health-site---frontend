import { useState } from 'react';
import { motion } from 'framer-motion';
import { STEP_TITLES, FREQUENCY_OPTIONS, AGREEMENT_OPTIONS } from '../data/surveySteps';
import { FaArrowRight, FaPencilAlt } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';

const FREQ_LABEL = (v) => FREQUENCY_OPTIONS.find((o) => o.value === v)?.label ?? '—';
const AGREE_LABEL = (v) => AGREEMENT_OPTIONS.find((o) => o.value === v)?.label ?? '—';
const VAL = (v) => (v === null || v === undefined || v === '') ? '—' : String(v);

const SectionCard = ({ title, stepIndex, onEdit, rows }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
      <span className="text-sm font-semibold text-heroBg">{title}</span>
      <button
        type="button"
        onClick={() => onEdit(stepIndex)}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        aria-label={`Edit ${title}`}
      >
        <FaPencilAlt className="w-3 h-3" /> Edit
      </button>
    </div>
    <dl className="divide-y divide-gray-50">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-start justify-between px-5 py-2.5 gap-4">
          <dt className="text-xs text-gray-500 flex-shrink-0 max-w-[55%]">{label}</dt>
          <dd className="text-xs font-medium text-gray-800 text-right">{VAL(value)}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const StepReview = ({ answers, onSubmit, onBack, onEdit, isSubmitting }) => {
  const [consent, setConsent] = useState(answers.consent ?? false);
  const { basicInfo: b, lifestyle: l, stress: s, emotional: em,
          anxiety: a, depression: d, social: so, digital: di, coping: c, history: h } = answers;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent) return;
    onSubmit({ consent });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-1 pb-2">
        <h2 className="text-2xl font-title font-bold text-heroBg">Review & Submit</h2>
        <p className="text-gray-500 text-sm">Take a moment to review your responses before submitting.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <SectionCard title="Basic Information" stepIndex={1} onEdit={onEdit} rows={[
          { label: 'Age', value: b.age },
          { label: 'Gender', value: b.gender },
          { label: 'Occupation', value: b.occupation },
          { label: 'Education', value: b.education },
          { label: 'Relationship Status', value: b.relationshipStatus },
          { label: 'Country', value: b.country },
        ]} />

        <SectionCard title="Lifestyle" stepIndex={2} onEdit={onEdit} rows={[
          { label: 'Sleep Duration', value: l.sleepDuration },
          { label: 'Sleep Quality', value: l.sleepQuality ? `${l.sleepQuality}/5` : null },
          { label: 'Exercise Frequency', value: l.exerciseFrequency },
          { label: 'Water Intake', value: l.waterIntake ? `${l.waterIntake} glasses` : null },
          { label: 'Diet Quality', value: l.dietQuality },
          { label: 'Daily Screen Time', value: l.screenTimeHours ? `${l.screenTimeHours} hrs` : null },
        ]} />

        <SectionCard title="Work & Study Stress" stepIndex={3} onEdit={onEdit} rows={[
          { label: 'Work/Study Stressful', value: FREQ_LABEL(s.workStressLevel) },
          { label: 'Struggles with Deadlines', value: FREQ_LABEL(s.deadlineStruggle) },
          { label: 'Feels Overwhelmed', value: FREQ_LABEL(s.feelOverwhelmed) },
          { label: 'Enjoys Work/Study', value: FREQ_LABEL(s.enjoyWork) },
          { label: 'Experiences Burnout', value: FREQ_LABEL(s.experienceBurnout) },
        ]} />

        <SectionCard title="Emotional Wellbeing" stepIndex={4} onEdit={onEdit} rows={[
          { label: 'Happiness', value: FREQ_LABEL(em.happiness) },
          { label: 'Motivation', value: FREQ_LABEL(em.motivation) },
          { label: 'Loneliness', value: FREQ_LABEL(em.loneliness) },
          { label: 'Emotional Stability', value: FREQ_LABEL(em.emotionalStability) },
        ]} />

        <SectionCard title="Anxiety Screening" stepIndex={5} onEdit={onEdit} rows={[
          { label: 'Nervous Without Reason', value: FREQ_LABEL(a.nervousWithoutReason) },
          { label: 'Excessive Worry', value: FREQ_LABEL(a.excessiveWorry) },
          { label: 'Racing Thoughts', value: FREQ_LABEL(a.racingThoughts) },
          { label: 'Frequent Tension', value: FREQ_LABEL(a.frequentTension) },
        ]} />

        <SectionCard title="Mood & Energy" stepIndex={6} onEdit={onEdit} rows={[
          { label: 'Lost Interest', value: FREQ_LABEL(d.lostInterest) },
          { label: 'Fatigue', value: FREQ_LABEL(d.fatigue) },
          { label: 'Feels Hopeless', value: FREQ_LABEL(d.feelHopeless) },
          { label: 'Concentration Issues', value: FREQ_LABEL(d.concentrationIssues) },
        ]} />

        <SectionCard title="Social Wellbeing" stepIndex={7} onEdit={onEdit} rows={[
          { label: 'Family Support', value: AGREE_LABEL(so.familySupport) },
          { label: 'Friend Support', value: AGREE_LABEL(so.friendSupport) },
          { label: 'Sense of Belonging', value: AGREE_LABEL(so.senseOfBelonging) },
        ]} />

        <SectionCard title="Coping Habits" stepIndex={9} onEdit={onEdit} rows={[
          { label: 'Habits Used', value: c.selectedHabits?.join(', ') || '—' },
        ]} />
      </motion.div>

      {/* Privacy reminder */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4">
        <IoShieldCheckmark className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">
          Your responses are encrypted and stored securely. This assessment is a wellness screening
          tool and does not constitute a medical diagnosis.
        </p>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
              consent ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
            }`}
          >
            {consent && <span className="text-white text-xs font-bold leading-none">✓</span>}
          </div>
        </div>
        <span className="text-sm text-gray-700 leading-relaxed">
          I understand this is a wellness screening tool, not a medical service. I consent to my
          responses being used for generating a personalised wellness report.
        </span>
      </label>

      {/* Nav */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors px-3 py-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!consent || isSubmitting}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-7 py-3 rounded-xl shadow-sm shadow-primary/20 transition-colors duration-150 text-sm"
        >
          {isSubmitting ? 'Submitting…' : 'Submit Assessment'}
          {!isSubmitting && <FaArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </form>
  );
};

export default StepReview;
