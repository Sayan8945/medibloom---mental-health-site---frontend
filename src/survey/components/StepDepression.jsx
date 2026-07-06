import { useState } from 'react';
import StepShell from './StepShell';
import LikertScale from './ui/LikertScale';
import QuestionRow from './ui/QuestionRow';
import { FREQUENCY_OPTIONS, DEPRESSION_QUESTIONS } from '../data/surveySteps';

const StepDepression = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Mood & Energy Check"
      subtitle="These gentle questions help us understand patterns in your mood and energy levels."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      {/* Compassionate framing note */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-xs text-gray-600 leading-relaxed -mt-2">
        💙 There's no right or wrong answer. These questions help us understand what support might be most helpful for you.
      </div>

      {DEPRESSION_QUESTIONS.map(({ id, label }) => (
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

export default StepDepression;
