import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';
import MoodEmojiPicker from './MoodEmojiPicker';
import MoodSlider from './MoodSlider';
import { NOTES_MAX_LENGTH } from './moodConstants';

const DEFAULTS = { mood: 3, energyLevel: 5, stressLevel: 5, sleepQuality: 5, notes: '' };

/**
 * The <30s daily check-in form. Used both for creating today's entry and
 * editing it (pass `initialEntry` + `isEditing`). `onSubmit` receives the
 * sanitized payload and should return a promise; errors are shown inline.
 */
const MoodCheckInForm = ({ initialEntry, isEditing = false, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => ({
    mood: initialEntry?.mood ?? DEFAULTS.mood,
    energyLevel: initialEntry?.energyLevel ?? DEFAULTS.energyLevel,
    stressLevel: initialEntry?.stressLevel ?? DEFAULTS.stressLevel,
    sleepQuality: initialEntry?.sleepQuality ?? DEFAULTS.sleepQuality,
    notes: initialEntry?.notes ?? DEFAULTS.notes,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-heroBg dark:text-white">
          How are you feeling today?
        </label>
        <MoodEmojiPicker value={form.mood} onChange={(v) => set('mood', v)} />
      </div>

      {/* Energy */}
      <MoodSlider
        label="How energetic do you feel today?"
        emoji="⚡"
        value={form.energyLevel}
        onChange={(v) => set('energyLevel', v)}
        color="#f59e0b"
      />

      {/* Stress */}
      <MoodSlider
        label="How stressed do you feel today?"
        emoji="🌪️"
        value={form.stressLevel}
        onChange={(v) => set('stressLevel', v)}
        color="#f43f5e"
      />

      {/* Sleep */}
      <MoodSlider
        label="How well did you sleep last night?"
        emoji="😴"
        value={form.sleepQuality}
        onChange={(v) => set('sleepQuality', v)}
        color="#0ea5e9"
        lowLabel="Very Poor"
        highLabel="Excellent"
      />

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label htmlFor="mood-notes" className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Anything you'd like to note about today? <span className="text-gray-400 dark:text-gray-500">(optional)</span>
          </label>
          <span className={`text-xs tabular-nums ${form.notes.length > NOTES_MAX_LENGTH ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500'}`}>
            {form.notes.length}/{NOTES_MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="mood-notes"
          value={form.notes}
          onChange={(e) => set('notes', e.target.value.slice(0, NOTES_MAX_LENGTH))}
          maxLength={NOTES_MAX_LENGTH}
          rows={3}
          placeholder="Exams this week, busy at work, feeling motivated…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-darkCard text-gray-800 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-150 resize-none"
        />
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-3 text-rose-700 dark:text-rose-300 text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-5 py-3 rounded-2xl text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        )}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-3 rounded-2xl text-sm shadow-md shadow-primary/25 transition-colors disabled:opacity-60"
        >
          {submitting ? (
            'Saving…'
          ) : (
            <>
              <IoCheckmarkCircle className="w-4 h-4" />
              {isEditing ? 'Update Check-in' : 'Save Check-in'}
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default MoodCheckInForm;
