import { useState } from 'react';
import StepShell from './StepShell';
import LikertScale from './ui/LikertScale';
import QuestionRow from './ui/QuestionRow';
import { FREQUENCY_OPTIONS, STRESS_QUESTIONS } from '../data/surveySteps';

const StepStress = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Work & Study Stress"
      subtitle="Let us understand how your academic or professional environment is affecting you."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <p className="text-xs text-gray-400 -mt-2 pb-2 border-b border-gray-100">
        Select how often each statement applies to you.
      </p>
      {STRESS_QUESTIONS.map(({ id, label }) => (
        <QuestionRow key={id} label={label}>
          <LikertScale
            name={id}
            options={FREQUENCY_OPTIONS}
            value={form[id]}
            onChange={(v) => setForm((p) => ({ ...p, [id]: v }))}
          />
        </QuestionRow>
      ))}
    </StepShell>
  );
};

export default StepStress;
