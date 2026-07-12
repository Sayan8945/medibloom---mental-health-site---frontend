/**
 * Shared constants for the Daily Mood Check-in feature.
 * Mirrors Backend/utils/moodUtils.js#MOOD_SCALE — keep both in sync.
 */

// Descending order (happiest first) for the picker UI.
export const MOOD_OPTIONS = [
  { value: 5, emoji: '😊', label: 'Very Happy' },
  { value: 4, emoji: '🙂', label: 'Happy' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 2, emoji: '😔', label: 'Sad' },
  { value: 1, emoji: '😰', label: 'Very Stressed' },
];

export const NOTES_MAX_LENGTH = 250;

export function getMoodMeta(value) {
  return MOOD_OPTIONS.find((m) => m.value === value) || null;
}

// Simple day-key formatter — matches the "en-GB, day + short month" style
// used across analytics/survey history pages.
export const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
