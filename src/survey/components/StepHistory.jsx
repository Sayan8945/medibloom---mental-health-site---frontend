import { useState } from 'react';
import StepShell from './StepShell';
import QuestionRow from './ui/QuestionRow';

const OPT_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const OptionGroup = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {OPT_OPTIONS.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
          value === opt.value
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const StepHistory = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <StepShell
      title="Optional History"
      subtitle="These questions are entirely optional. You may select 'Prefer not to say' for any question."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed -mt-2">
        🔒 All responses in this section are optional and handled with the utmost confidentiality.
      </div>

      <QuestionRow label="Have you previously attended counseling or therapy?" emoji="🛋️">
        <OptionGroup value={form.previousTherapy} onChange={(v) => set('previousTherapy', v)} />
      </QuestionRow>

      <QuestionRow label="Have you ever received a mental health diagnosis?" emoji="📋">
        <OptionGroup value={form.diagnosisHistory} onChange={(v) => set('diagnosisHistory', v)} />
      </QuestionRow>

      <QuestionRow label="Are you currently taking any medication for mental health?" emoji="💊">
        <OptionGroup value={form.currentMedication} onChange={(v) => set('currentMedication', v)} />
      </QuestionRow>

      <QuestionRow label="Is there a family history of mental health conditions?" emoji="👨‍👩‍👧">
        <OptionGroup value={form.familyHistory} onChange={(v) => set('familyHistory', v)} />
      </QuestionRow>
    </StepShell>
  );
};

export default StepHistory;
