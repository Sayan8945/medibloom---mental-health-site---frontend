// Multi-select chip group
const ChipSelect = ({ options, selected = [], onChange, max }) => {
  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((v) => v !== opt));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={active}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${
              active
                ? 'bg-primary border-primary text-white'
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

export default ChipSelect;
