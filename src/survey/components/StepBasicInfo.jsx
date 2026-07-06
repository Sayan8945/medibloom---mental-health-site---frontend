import { useForm } from 'react-hook-form';
import {
  GENDER_OPTIONS, EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS, RELATIONSHIP_OPTIONS,
} from '../data/surveySteps';
import StepShell from './StepShell';

const selectClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-150';
const inputClass = selectClass;
const errorClass = 'text-xs text-red-500 mt-1';

const StepBasicInfo = ({ data, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: data });

  return (
    <StepShell
      title="Basic Information"
      subtitle="Help us understand a little about you. This information is kept confidential."
      onSubmit={handleSubmit(onNext)}
      onBack={onBack}
    >
      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
        <select className={selectClass} {...register('gender')}>
          <option value="">Select gender</option>
          {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
        <select className={selectClass} {...register('occupation')}>
          <option value="">Select occupation</option>
          {OCCUPATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Education */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Education Level</label>
        <select className={selectClass} {...register('education')}>
          <option value="">Select education level</option>
          {EDUCATION_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {/* Relationship */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Relationship Status</label>
        <select className={selectClass} {...register('relationshipStatus')}>
          <option value="">Select status</option>
          {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Country / City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
          <input type="text" placeholder="e.g. India" className={inputClass} {...register('country')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. Mumbai" className={inputClass} {...register('city')} />
        </div>
      </div>
    </StepShell>
  );
};

export default StepBasicInfo;
