import { useForm } from 'react-hook-form';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  GENDER_OPTIONS, EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS, RELATIONSHIP_OPTIONS,
} from '../data/surveySteps';
import StepShell from './StepShell';

const selectClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-150';
const inputClass = selectClass;
const errorClass = 'text-xs text-red-500 mt-1';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

const StepBasicInfo = ({ data, onNext, onBack, prefilled = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: data });

  return (
    <StepShell
      title="Basic Information"
      subtitle={
        prefilled
          ? "We've filled this in from your last assessment. Review it and update anything that has changed."
          : 'Help us understand a little about you. This information is kept confidential.'
      }
      submitLabel={prefilled ? 'Looks Good, Continue' : 'Continue'}
      onSubmit={handleSubmit(onNext)}
      onBack={onBack}
    >
      {prefilled && (
        <div className="flex items-start gap-2.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl px-4 py-3 -mt-1">
          <IoCheckmarkCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Prefilled from your previous assessment. No need to re-enter unchanged details.
          </p>
        </div>
      )}
      {/* Age */}
      <div>
        <label className={labelClass}>
          Age <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          min={10} max={100}
          placeholder="e.g. 22"
          className={inputClass}
          {...register('age', { required: 'Age is required', min: { value: 10, message: 'Must be at least 10' }, max: { value: 100, message: 'Must be 100 or under' } })}
        />
        {errors.age && <p className={errorClass}>{errors.age.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className={labelClass}>Gender</label>
        <select className={selectClass} {...register('gender')}>
          <option value="">Select gender</option>
          {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Occupation */}
      <div>
        <label className={labelClass}>Occupation</label>
        <select className={selectClass} {...register('occupation')}>
          <option value="">Select occupation</option>
          {OCCUPATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Education */}
      <div>
        <label className={labelClass}>Education Level</label>
        <select className={selectClass} {...register('education')}>
          <option value="">Select education level</option>
          {EDUCATION_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {/* Relationship */}
      <div>
        <label className={labelClass}>Relationship Status</label>
        <select className={selectClass} {...register('relationshipStatus')}>
          <option value="">Select status</option>
          {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Country / City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Country</label>
          <input type="text" placeholder="e.g. India" className={inputClass} {...register('country')} />
        </div>
        <div>
          <label className={labelClass}>City <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. Mumbai" className={inputClass} {...register('city')} />
        </div>
      </div>
    </StepShell>
  );
};

export default StepBasicInfo;
