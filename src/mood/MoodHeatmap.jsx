import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MdChevronLeft, MdChevronRight, MdCalendarMonth } from 'react-icons/md';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// 0-10 wellness value -> Tailwind background class (green scale, matches primary)
function colorForValue(value) {
  if (value === undefined || value === null) return 'bg-gray-50 dark:bg-white/5';
  if (value >= 8) return 'bg-emerald-500';
  if (value >= 6.5) return 'bg-emerald-400';
  if (value >= 5) return 'bg-amber-300';
  if (value >= 3.5) return 'bg-orange-400';
  return 'bg-rose-400';
}

/**
 * Monthly calendar heatmap — one cell per day, colored by the day's
 * combined wellness value (see Backend/controllers/moodController.js
 * #getMoodAnalytics `heatmap` array: [{ date, value }]).
 * Memoized month-grid calculation so re-renders (e.g. on hover) stay cheap.
 */
const MoodHeatmap = ({ heatmap }) => {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month

  const valueByDay = useMemo(() => {
    const map = {};
    (heatmap || []).forEach((h) => {
      const key = new Date(h.date).toISOString().slice(0, 10);
      map[key] = h.value;
    });
    return map;
  }, [heatmap]);

  const { label, weeks } = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = target.getFullYear();
    const month = target.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Monday-first offset
    const startWeekday = (firstDay.getDay() + 6) % 7;

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const key = dateObj.toISOString().slice(0, 10);
      cells.push({ day: d, key, value: valueByDay[key] });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const weekRows = [];
    for (let i = 0; i < cells.length; i += 7) weekRows.push(cells.slice(i, i + 7));

    return {
      label: target.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      weeks: weekRows,
    };
  }, [monthOffset, valueByDay]);

  const isCurrentMonth = monthOffset === 0;

  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-heroBg dark:text-white flex items-center gap-2">
          <MdCalendarMonth className="w-4 h-4 text-primary" />
          Monthly Wellness Heatmap
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            aria-label="Previous month"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <MdChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-28 text-center">{label}</span>
          <button
            onClick={() => setMonthOffset((m) => Math.min(0, m + 1))}
            disabled={isCurrentMonth}
            aria-label="Next month"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <MdChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i} className="text-[10px] text-gray-400 dark:text-gray-500 text-center">{d}</span>
        ))}
      </div>

      <div className="space-y-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map((cell, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: (wi * 7 + di) * 0.006 }}
                title={cell ? `${cell.key}${cell.value !== undefined ? ` — ${cell.value}/10` : ' — no check-in'}` : ''}
                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium ${
                  cell ? colorForValue(cell.value) : ''
                } ${cell?.value !== undefined ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}
              >
                {cell?.day || ''}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-4">
        <span className="text-[10px] text-gray-400 dark:text-gray-500">Low</span>
        {['bg-rose-400', 'bg-orange-400', 'bg-amber-300', 'bg-emerald-400', 'bg-emerald-500'].map((c) => (
          <span key={c} className={`w-3 h-3 rounded ${c}`} />
        ))}
        <span className="text-[10px] text-gray-400 dark:text-gray-500">High</span>
      </div>
    </div>
  );
};

export default MoodHeatmap;
