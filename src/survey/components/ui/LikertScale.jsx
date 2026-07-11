// 5-point Likert scale — horizontal pill buttons
const LikertScale = ({ options, value, onChange, name }) => (
  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${
            active
              ? 'bg-primary border-primary text-white shadow-sm shadow-primary/30'
              : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export default LikertScale;
