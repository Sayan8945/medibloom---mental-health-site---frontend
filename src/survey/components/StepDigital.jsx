import { useState } from 'react';
import StepShell from './StepShell';
import LikertScale from './ui/LikertScale';
import QuestionRow from './ui/QuestionRow';
import { FREQUENCY_OPTIONS, DIGITAL_QUESTIONS } from '../data/surveySteps';

const CYBERBULLYING_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const StepDigital = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Digital Wellbeing"
      subtitle="Our screen habits can have a significant impact on sleep, mood, and focus."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <p className="text-xs text-gray-400 -mt-2 pb-2 border-b border-gray-100">
        Select how often each statement applies to you.
      </p>

      {DIGITAL_QUESTIONS.map(({ id, label }) => (
        <QuestionRow key={id} label={label}>
          <LikertScale
            name={id}
            options={FREQUENCY_OPTIONS}
            value={form[id]}
            onChange={(v) => setForm((p) => ({ ...p, [id]: v }))}
          />
        </QuestionRow>
      ))}

      {/* Optional cyberbullying question */}
      <QuestionRow
        label="Have you experienced cyberbullying or online harassment?"
        emoji="🛡️"
      >
        <p className="text-xs text-gray-400 mb-2">Optional — you may skip this question.</p>
        <div className="flex flex-wrap gap-2">
          {CYBERBULLYING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((p) => ({ ...p, cyberbullyingExperience: opt.value }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                form.cyberbullyingExperience === opt.value
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </QuestionRow>
    </StepShell>
  );
};

export default StepDigital;
