import { useTheme } from '../../../contexts/ThemeContext';

// Labelled range slider
const SliderInput = ({ value, onChange, min = 0, max = 10, step = 1, label, unit = '', markers }) => {
  const { isDark } = useTheme();
  const pct = ((value - min) / (max - min)) * 100;
  const trackBg = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-base font-semibold text-primary tabular-nums">
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            background: `linear-gradient(to right, #06a055 ${pct}%, ${trackBg} ${pct}%)`,
          }}
        />
      </div>
      {markers && (
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-0.5">
          {markers.map((m) => <span key={m}>{m}</span>)}
        </div>
      )}
    </div>
  );
};

export default SliderInput;
