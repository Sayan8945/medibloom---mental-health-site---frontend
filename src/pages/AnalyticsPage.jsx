import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../utils/api';
import { IoArrowBack, IoShieldCheckmark } from 'react-icons/io5';
import { MdInsights, MdAutoAwesome, MdCalendarMonth, MdClose } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';

import SummaryStats   from '../analytics/SummaryStats';
import ComparisonCard from '../analytics/ComparisonCard';
import TrendCharts    from '../analytics/TrendCharts';
import InsightsPanel  from '../analytics/InsightsPanel';
import BadgesRow      from '../analytics/BadgesRow';

const RANGES = [
  { id: 'all', label: 'All Time' },
  { id: '7d',  label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '1y',  label: '1 Year' },
  { id: 'custom', label: 'Custom' },
];

// ── Skeleton loader ─────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 p-5 h-28" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-64" />
      <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-64" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-52" />
      ))}
    </div>
  </div>
);

// ── Empty state ─────────────────────────────────────────────
const EmptyState = ({ onTake }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center gap-5 py-16"
  >
    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
      <MdInsights className="w-10 h-10 text-primary/60" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-heroBg dark:text-white">No analytics yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
        Complete at least one assessment to begin tracking your wellness journey.
      </p>
    </div>
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onTake}
      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-2xl text-sm shadow-md shadow-primary/25 transition-colors"
    >
      Take Assessment <FaArrowRight className="w-3.5 h-3.5" />
    </motion.button>
  </motion.div>
);

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [range, setRange]       = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo]     = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [summary, setSummary]   = useState(null);
  const [comparison, setComparison] = useState(null);
  const [trends, setTrends]     = useState(null);
  const [insights, setInsights] = useState([]);
  const [badges, setBadges]     = useState([]);

  const loadData = useCallback(async (selectedRange) => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, comparisonRes, trendsRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/comparison'),
        api.get(`/analytics/trends?range=${selectedRange}`),
      ]);
      setSummary(summaryRes.data.summary);
      setInsights(summaryRes.data.insights || []);
      setBadges(summaryRes.data.badges || []);
      setComparison(comparisonRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { loadData(range); }, []); // eslint-disable-line

  // Reload trends when range changes (summary/comparison are range-independent)
  const handleRangeChange = async (newRange) => {
    if (newRange === 'custom') {
      // Wait for the user to pick dates and confirm before fetching
      setRange('custom');
      setShowCustomPicker(true);
      return;
    }
    setShowCustomPicker(false);
    setRange(newRange);
    try {
      const trendsRes = await api.get(`/analytics/trends?range=${newRange}`);
      setTrends(trendsRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApplyCustomRange = async () => {
    if (!customFrom) return;
    try {
      const params = new URLSearchParams({ range: 'custom', from: customFrom });
      if (customTo) params.append('to', customTo);
      const trendsRes = await api.get(`/analytics/trends?${params.toString()}`);
      setTrends(trendsRes.data);
      setShowCustomPicker(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const hasData = summary && summary.count > 0;

  return (
    <div className={isDark ? 'dark' : ''}>
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] dark:bg-none dark:bg-darkBg font-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm font-medium transition-colors"
            >
              <IoArrowBack className="w-4 h-4" /> Back to Home
            </button>
            <ThemeToggle showLabel />
          </div>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MdInsights className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-title font-bold text-heroBg dark:text-white leading-none">
                Your Wellness Journey
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {user?.fullName?.split(' ')[0]}'s progress over time
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5 text-rose-700 dark:text-rose-300 text-sm text-center">
            {error}
          </div>
        ) : !hasData ? (
          <EmptyState onTake={() => navigate('/survey')} />
        ) : (
          <div className="space-y-8">
            {/* Summary stats */}
            <SummaryStats summary={summary} />

            {/* Insights */}
            <InsightsPanel insights={insights} />

            {/* Badges */}
            <BadgesRow badges={badges} />

            {/* Comparison */}
            <div className="space-y-3">
              <h2 className="text-lg font-title font-bold text-heroBg dark:text-white flex items-center gap-2">
                <MdAutoAwesome className="w-5 h-5 text-primary" />
                Latest vs Previous
              </h2>
              <ComparisonCard
                comparison={comparison?.comparison || []}
                hasComparison={comparison?.hasComparison}
              />
            </div>

            {/* Range filter + Trends */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-title font-bold text-heroBg dark:text-white">Trend Analytics</h2>
                <div className="flex gap-1 bg-white dark:bg-darkCard rounded-xl border border-gray-100 dark:border-white/10 p-1 shadow-sm">
                  {RANGES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRangeChange(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        range === r.id
                          ? 'bg-primary text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {showCustomPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-wrap items-end gap-3 bg-white dark:bg-darkCard rounded-xl border border-gray-100 dark:border-white/10 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs font-medium mb-2 sm:mb-0">
                    <MdCalendarMonth className="w-4 h-4" />
                    Custom range
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-darkBg text-heroBg dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">To (optional)</label>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-darkBg text-heroBg dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <button
                    onClick={handleApplyCustomRange}
                    disabled={!customFrom}
                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => { setShowCustomPicker(false); handleRangeChange('all'); }}
                    className="text-xs font-medium px-3 py-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
                  >
                    <MdClose className="w-3.5 h-3.5" /> Cancel
                  </button>
                </motion.div>
              )}

              <TrendCharts
                series={trends?.series}
                monthlyAverages={trends?.monthlyAverages}
                radar={trends?.radar}
              />
            </div>

            {/* Disclaimer */}
            <p className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 mt-0.5" />
              These analytics are for wellness tracking only and do not constitute a medical
              diagnosis. If you are experiencing distress, please consult a qualified professional.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AnalyticsPage;
