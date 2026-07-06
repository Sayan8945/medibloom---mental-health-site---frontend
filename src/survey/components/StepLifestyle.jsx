import { useState } from 'react';
import StepShell from './StepShell';
import SliderInput from './ui/SliderInput';
import QuestionRow from './ui/QuestionRow';
import { SLEEP_DURATION_OPTIONS, EXERCISE_OPTIONS, DIET_OPTIONS } from '../data/surveySteps';

const selectClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-150';

const ToggleGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
          value === opt
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const YesNo = ({ value, onChange }) => (
  <div className="flex gap-3">
    {['Yes', 'No'].map((v) => (
      <button
        key={v}
        type="button"
        onClick={() => onChange(v === 'Yes')}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
          value === (v === 'Yes')
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50'
        }`}
      >
        {v}
      </button>
    ))}
  </div>
);

const StepLifestyle = ({ data, onNext, onBack }) => {
  const [form, setForm] = useState(data);
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <StepShell
      title="Lifestyle"
      subtitle="Your daily habits give important context to your overall wellbeing."
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      onBack={onBack}
    >
      <QuestionRow label="How many hours do you usually sleep per night?" required>
        <ToggleGroup options={SLEEP_DURATION_OPTIONS} value={form.sleepDuration} onChange={(v) => set('sleepDuration', v)} />
      </QuestionRow>

      <QuestionRow label="How would you rate your sleep quality?" emoji="😴">
        <SliderInput
          value={form.sleepQuality}
          onChange={(v) => set('sleepQuality', v)}
          min={1} max={5} step={1}
          label="Sleep quality"
          markers={['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']}
        />
      </QuestionRow>

      <QuestionRow label="How often do you exercise?" emoji="🏃">
        <ToggleGroup options={EXERCISE_OPTIONS} value={form.exerciseFrequency} onChange={(v) => set('exerciseFrequency', v)} />
      </QuestionRow>

      <QuestionRow label="How many glasses of water do you drink per day?" emoji="💧">
        <SliderInput
          value={form.waterIntake}
          onChange={(v) => set('waterIntake', v)}
          min={0} max={15} step={1}
          label="Glasses per day"
          unit=" glasses"
          markers={['0', '5', '10', '15+']}
        />
      </QuestionRow>

      <QuestionRow label="How would you describe your diet quality?" emoji="🥗">
        <ToggleGroup options={DIET_OPTIONS} value={form.dietQuality} onChange={(v) => set('dietQuality', v)} />
      </QuestionRow>

      <QuestionRow label="Average daily screen time (outside of work/study)?" emoji="📱">
        <SliderInput
          value={form.screenTimeHours}
          onChange={(v) => set('screenTimeHours', v)}
          min={0} max={12} step={0.5}
          label="Hours per day"
          unit=" hrs"
          markers={['0', '3', '6', '9', '12+']}
        />
      </QuestionRow>

      <QuestionRow label="How many days per week do you spend time outdoors?" emoji="🌳">
        <SliderInput
          value={form.outdoorActivity}
          onChange={(v) => set('outdoorActivity', v)}
          min={0} max={7} step={1}
          label="Days per week"
          unit=" days"
          markers={['0', '2', '4', '7']}
        />
      </QuestionRow>

      <QuestionRow label="Do you have regular hobbies or leisure activities?" emoji="🎨">
        <YesNo value={form.hasHobbies} onChange={(v) => set('hasHobbies', v)} />
      </QuestionRow>

      <QuestionRow label="Do you follow a consistent daily routine?" emoji="📅">
        <YesNo value={form.consistentRoutine} onChange={(v) => set('consistentRoutine', v)} />
      </QuestionRow>
    </StepShell>
  );
};

export default StepLifestyle;
