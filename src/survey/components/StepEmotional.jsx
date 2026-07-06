import { useState } from 'react';
import StepShell from './StepShell';
import EmojiRating from './ui/EmojiRating';
import QuestionRow from './ui/QuestionRow';
import { EMOTIONAL_QUESTIONS } from '../data/surveySteps';

const StepEmotional = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Emotional Wellbeing"
      subtitle="Reflect on how you've been feeling emotionally over the past two weeks."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <p className="text-xs text-gray-400 -mt-2 pb-2 border-b border-gray-100">
        Select the emoji that best represents how often each statement applies.
      </p>
      {EMOTIONAL_QUESTIONS.map(({ id, label, emoji }) => (
        <QuestionRow key={id} label={label} emoji={emoji}>
          <EmojiRating
            name={id}
            value={form[id]}
            onChange={(v) => setForm((p) => ({ ...p, [id]: v }))}
          />
        </QuestionRow>
      ))}
    </StepShell>
  );
};

export default StepEmotional;
