import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../utils/api';
import { IoArrowBack, IoShieldCheckmark } from 'react-icons/io5';
import { MdInsights, MdEdit } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';

import InsightsPanel from '../analytics/InsightsPanel';
import BadgesRow from '../analytics/BadgesRow';
import MoodTrendCharts from '../mood/MoodTrendCharts';
import MoodHeatmap from '../mood/MoodHeatmap';
import MoodHistoryList from '../mood/MoodHistoryList';
import MoodCheckInModal from '../mood/MoodCheckInModal';
import { getMoodMeta } from '../mood/moodConstants';

// ── Skeleton ─────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-32" />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-52" />
      ))}
    </div>
    <div className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-64" />
  </div>
);

// ── Empty state ─────────────────────────────────────────────
const EmptyState = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center gap-5 py-16"
  >
    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
      <MdInsights className="w-10 h-10 text-primary/60" />
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-lg font-semibold text-heroBg dark:text-white">No check-ins yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Start tracking your daily wellbeing to unlock personalized insights and trend analysis.
      </p>
    </div>
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onStart}
      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-2xl text-sm shadow-md shadow-primary/25 transition-colors"
    >
      Start Check-in <FaArrowRight className="w-3.5 h-3.5" />
    </motion.button>
  </motion.div>
);

const MoodPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [todayEntry, setTodayEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsRes, todayRes, historyRes] = await Promise.all([
        api.get('/mood/analytics'),
        api.get('/mood/today'),
        api.get('/mood/history?page=1&limit=10'),
      ]);
      setAnalytics(analyticsRes.data);
      setTodayEntry(todayRes.data.entry);
      setHistory(historyRes.data.entries);
      setPagination(historyRes.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handlePageChange = async (page) => {
    setHistoryLoading(true);
    try {
      const res = await api.get(`/mood/history?page=${page}&limit=10`);
      setHistory(res.data.entries);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    if (todayEntry) {
      const res = await api.put(`/mood/${todayEntry._id}`, payload);
      setTodayEntry(res.data.entry);
    } else {
      const res = await api.post('/mood', payload);
      setTodayEntry(res.data.entry);
    }
    setModalOpen(false);
    loadAll();
  };

  const hasData = analytics?.hasData;
  const moodMeta = todayEntry ? getMoodMeta(todayEntry.mood) : null;

  return (
    <>
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

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MdInsights className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-title font-bold text-heroBg dark:text-white leading-none">
                  Daily Mood Check-ins
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                  {user?.fullName?.split(' ')[0]}'s wellbeing journal
                  {analytics?.streaks?.current > 0 && (
                    <span> · 🔥 {analytics.streaks.current} day streak</span>
                  )}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-2xl text-sm shadow-md shadow-primary/25 transition-colors"
            >
              {todayEntry ? <MdEdit className="w-4 h-4" /> : <FaArrowRight className="w-3.5 h-3.5" />}
              {todayEntry ? "Edit Today's Check-in" : "Today's Check-in"}
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5 text-rose-700 dark:text-rose-300 text-sm text-center">
            {error}
          </div>
        ) : !hasData ? (
          <EmptyState onStart={() => setModalOpen(true)} />
        ) : (
          <div className="space-y-8">
            {/* Today snapshot */}
            {todayEntry && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5"
              >
                <span className="text-4xl">{moodMeta?.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-heroBg dark:text-white">{moodMeta?.label} today</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Energy {todayEntry.energyLevel}/10 · Stress {todayEntry.stressLevel}/10 · Sleep {todayEntry.sleepQuality}/10
                  </p>
                </div>
              </motion.div>
            )}

            {/* AI Insights */}
            <InsightsPanel insights={analytics.insights} />

            {/* Badges */}
            <BadgesRow badges={analytics.badges} />

            {/* Trend charts */}
            <div className="space-y-4">
              <h2 className="text-lg font-title font-bold text-heroBg dark:text-white">Trends</h2>
              <MoodTrendCharts series={analytics.series} weeklyAverages={analytics.weeklyAverages} />
            </div>

            {/* Heatmap */}
            <MoodHeatmap heatmap={analytics.heatmap} />

            {/* History */}
            <div className="space-y-4">
              <h2 className="text-lg font-title font-bold text-heroBg dark:text-white">Recent Check-ins</h2>
              <div className={historyLoading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
                <MoodHistoryList entries={history} pagination={pagination} onPageChange={handlePageChange} />
              </div>
            </div>

            {/* Disclaimer */}
            <p className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 mt-0.5" />
              These check-ins are for wellness tracking only and do not constitute a medical
              diagnosis. If you are experiencing distress, please consult a qualified professional.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>

    <MoodCheckInModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      initialEntry={todayEntry}
      isEditing={!!todayEntry}
      onSubmit={handleSubmit}
    />
    </>
  );
};

export default MoodPage;
