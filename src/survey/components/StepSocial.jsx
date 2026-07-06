import { useState } from 'react';
import StepShell from './StepShell';
import LikertScale from './ui/LikertScale';
import QuestionRow from './ui/QuestionRow';
import { AGREEMENT_OPTIONS, SOCIAL_QUESTIONS } from '../data/surveySteps';

const StepSocial = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Social Wellbeing"
      subtitle="Your relationships and social connections are a vital part of mental wellness."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <p className="text-xs text-gray-400 -mt-2 pb-2 border-b border-gray-100">
        Indicate how much you agree with each statement.
      </p>
      {SOCIAL_QUESTIONS.map(({ id, label }) => (
        <QuestionRow key={id} label={label}>
          <LikertScale
            name={id}
            options={AGREEMENT_OPTIONS}
            value={form[id]}
            onChange={(v) => setForm((p) => ({ ...p, [id]: v }))}
          />
        </QuestionRow>
      ))}
    </StepShell>
  );
};

export default StepSocial;
