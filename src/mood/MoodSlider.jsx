import { useTheme } from '../contexts/ThemeContext';

/**
 * 1-10 labelled range slider with an animated fill and "Low ↔ High" markers.
 * Styled to match survey/components/ui/SliderInput.jsx conventions, with a
 * slightly larger thumb + smoother gradient for the "premium" feel requested
 * for the daily check-in.
 */
const MoodSlider = ({ value, onChange, label, emoji, lowLabel = 'Low', highLabel = 'High', color = '#06a055' }) => {
  const { isDark } = useTheme();
  const min = 1;
  const max = 10;
  const pct = ((value - min) / (max - min)) * 100;
  const trackBg = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          {emoji && <span className="text-base">{emoji}</span>}
          {label}
        </span>
        <span className="text-lg font-bold tabular-nums" style={{ color }}>
          {value}<span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/10</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2.5 rounded-full appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, ${trackBg} ${pct}%)` }}
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-0.5">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

export default MoodSlider;
