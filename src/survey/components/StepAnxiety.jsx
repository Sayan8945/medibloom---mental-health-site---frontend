import { useState } from 'react';
import StepShell from './StepShell';
import LikertScale from './ui/LikertScale';
import QuestionRow from './ui/QuestionRow';
import { FREQUENCY_OPTIONS, ANXIETY_QUESTIONS } from '../data/surveySteps';

const StepAnxiety = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Anxiety Screening"
      subtitle="These questions help identify anxiety-related patterns. Answer honestly — all responses are confidential."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <p className="text-xs text-gray-400 -mt-2 pb-2 border-b border-gray-100">
        Select how often each statement has applied to you over the past two weeks.
      </p>
      {ANXIETY_QUESTIONS.map(({ id, label }) => (
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

export default StepAnxiety;
