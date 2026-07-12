import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const CHART_COLORS = {
  mood: '#8b5cf6',
  energyLevel: '#f59e0b',
  stressLevel: '#f43f5e',
  sleepQuality: '#0ea5e9',
};

// ── Shared chart card wrapper — mirrors analytics/TrendCharts.jsx ──
const ChartCard = ({ title, subtitle, children, delay = 0, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5"
  >
    <div className="mb-4 flex items-center gap-2">
      {accent && <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />}
      <div>
        <h3 className="text-sm font-semibold text-heroBg dark:text-white leading-none">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-heroBg text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const MetricLine = ({ title, dataKey, domain, color, series, delay, grid, tick }) => (
  <ChartCard title={title} accent={color} delay={delay}>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={series} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
        <YAxis domain={domain} tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={title}
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3, fill: color }}
          activeDot={{ r: 5 }}
          animationDuration={900}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>
);

/**
 * Mood/Energy/Stress/Sleep trend line charts + weekly average mood bar
 * chart. `series` = analytics response's `series` array, `weeklyAverages`
 * = `weeklyAverages` array (see Backend/controllers/moodController.js).
 */
const MoodTrendCharts = ({ series, weeklyAverages }) => {
  const { isDark } = useTheme();
  const grid = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';
  const tick = isDark ? '#64748b' : '#94a3b8';
  const barCursor = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc';

  if (!series || series.length === 0) {
    return (
      <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Not enough check-ins yet to display trends.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Metric lines — mood, energy, stress, sleep */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricLine title="Mood Trend"   dataKey="mood"         domain={[1, 5]}  color={CHART_COLORS.mood}         series={series} delay={0}    grid={grid} tick={tick} />
        <MetricLine title="Energy Trend" dataKey="energyLevel"  domain={[1, 10]} color={CHART_COLORS.energyLevel}  series={series} delay={0.05} grid={grid} tick={tick} />
        <MetricLine title="Stress Trend" dataKey="stressLevel"  domain={[1, 10]} color={CHART_COLORS.stressLevel}  series={series} delay={0.1}  grid={grid} tick={tick} />
        <MetricLine title="Sleep Trend"  dataKey="sleepQuality" domain={[1, 10]} color={CHART_COLORS.sleepQuality} series={series} delay={0.15} grid={grid} tick={tick} />
      </div>

      {/* Weekly average mood */}
      <ChartCard title="Weekly Average Mood" subtitle="Average mood score per week (1-5)" accent={CHART_COLORS.mood} delay={0.1}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyAverages} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: barCursor }} />
            <Bar dataKey="average" name="Avg Mood" fill={CHART_COLORS.mood} radius={[6, 6, 0, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default MoodTrendCharts;
