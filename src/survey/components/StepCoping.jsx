import { useState } from 'react';
import StepShell from './StepShell';
import ChipSelect from './ui/ChipSelect';
import QuestionRow from './ui/QuestionRow';
import { COPING_HABITS } from '../data/surveySteps';

const StepCoping = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);

  return (
    <StepShell
      title="Coping Habits"
      subtitle="Understanding how you manage stress helps us tailor recommendations for you."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <QuestionRow
        label="Which of the following do you use to cope with stress or difficult emotions?"
        emoji="🌿"
      >
        <p className="text-xs text-gray-400 mb-3">Select all that apply.</p>
        <ChipSelect
          options={COPING_HABITS}
          selected={form.selectedHabits}
          onChange={(v) => setForm((p) => ({ ...p, selectedHabits: v }))}
        />
      </QuestionRow>

      <QuestionRow label="Any other coping strategies you'd like to mention?" emoji="✏️">
        <textarea
          rows={3}
          placeholder="e.g. cooking, gardening, volunteering..."
          value={form.otherHabits}
          onChange={(e) => setForm((p) => ({ ...p, otherHabits: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-150 resize-none"
        />
      </QuestionRow>
    </StepShell>
  );
};

export default StepCoping;
