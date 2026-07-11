// 5-point emoji scale with label
const EMOJI_SCALE = [
  { value: 0, emoji: '😞', label: 'Never' },
  { value: 1, emoji: '😕', label: 'Rarely' },
  { value: 2, emoji: '😐', label: 'Sometimes' },
  { value: 3, emoji: '🙂', label: 'Often' },
  { value: 4, emoji: '😄', label: 'Always' },
];

const EmojiRating = ({ value, onChange, name }) => (
  <div className="flex gap-3 flex-wrap" role="radiogroup" aria-label={name}>
    {EMOJI_SCALE.map((item) => {
      const active = value === item.value;
      return (
        <button
          key={item.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(item.value)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none min-w-[56px] ${
            active
              ? 'border-primary bg-primary/10 scale-110'
              : 'border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 hover:border-primary/40'
          }`}
        >
          <span className="text-2xl leading-none">{item.emoji}</span>
          <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
            {item.label}
          </span>
        </button>
      );
    })}
  </div>
);

export default EmojiRating;
