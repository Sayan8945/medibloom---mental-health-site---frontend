import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const CHART_COLORS = {
  overall:    '#06a055',
  stress:     '#f59e0b',
  anxiety:    '#8b5cf6',
  depression: '#3b82f6',
  sleep:      '#0ea5e9',
};

// ── Shared chart card wrapper ───────────────────────────────
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

// Custom tooltip
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

// ── Single-metric line chart ────────────────────────────────
const MetricLine = ({ title, dataKey, color, series, delay, grid, tick }) => (
  <ChartCard title={title} accent={color} delay={delay}>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={series} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
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

const TrendCharts = ({ series, monthlyAverages, radar }) => {
  const { isDark } = useTheme();
  const grid = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';
  const tick = isDark ? '#64748b' : '#94a3b8';
  const polarGrid = isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0';
  const polarTick = isDark ? '#94a3b8' : '#64748b';
  const barCursor = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc';

  if (!series || series.length === 0) {
    return (
      <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Not enough data to display trends yet. Complete more assessments to unlock charts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Wellness trend — full width */}
      <ChartCard
        title="Wellness Trend"
        subtitle="Your overall wellness score over time"
        accent={CHART_COLORS.overall}
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="wellnessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.overall} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.overall} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="overall" name="Wellness"
              stroke={CHART_COLORS.overall} strokeWidth={3}
              dot={{ r: 4, fill: CHART_COLORS.overall }} activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Metric lines — up to 4 across on wide screens to cut down scrolling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricLine title="Stress Trend"     dataKey="stress"     color={CHART_COLORS.stress}     series={series} delay={0.05} grid={grid} tick={tick} />
        <MetricLine title="Anxiety Trend"    dataKey="anxiety"    color={CHART_COLORS.anxiety}    series={series} delay={0.1} grid={grid} tick={tick} />
        <MetricLine title="Mood Trend"       dataKey="depression" color={CHART_COLORS.depression} series={series} delay={0.15} grid={grid} tick={tick} />
        <MetricLine title="Sleep Quality Trend" dataKey="sleep"   color={CHART_COLORS.sleep}      series={series} delay={0.2} grid={grid} tick={tick} />
      </div>

      {/* Monthly average + Radar side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Monthly Average Wellness" subtitle="Average score per month" accent="#06a055" delay={0.1}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyAverages} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: tick }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: barCursor }} />
              <Bar dataKey="average" name="Avg Wellness" fill="#06a055" radius={[6, 6, 0, 0]} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Latest Assessment Profile" subtitle="Your most recent wellness dimensions" accent="#8b5cf6" delay={0.15}>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radar} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <PolarGrid stroke={polarGrid} />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: polarTick }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="value" stroke="#06a055" fill="#06a055" fillOpacity={0.35} animationDuration={900} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default TrendCharts;
