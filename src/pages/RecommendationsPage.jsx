import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../utils/api';
import { IoArrowBack, IoShieldCheckmark, IoRefresh } from 'react-icons/io5';
import { MdAutoAwesome } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';

import RecommendationCard from '../recommendations/RecommendationCard';

// ── Skeleton loader ─────────────────────────────────────────
const Skeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-white/10 h-28" />
    ))}
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
      <MdAutoAwesome className="w-10 h-10 text-primary/60" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-heroBg dark:text-white">No recommendations yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
        Complete an assessment so we can tailor suggestions to your wellness scores.
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

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [error, setError]                 = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [personalized, setPersonalized]   = useState(false);
  const [generatedAt, setGeneratedAt]     = useState(null);

  const loadData = useCallback(async (forceRefresh = false) => {
    forceRefresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const res = await api.get('/recommendations', {
        params: forceRefresh ? { refresh: true } : undefined,
      });
      setRecommendations(res.data.recommendations || []);
      setPersonalized(!!res.data.personalized);
      setGeneratedAt(res.data.generatedAt || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(false); }, [loadData]);

  const hasData = recommendations.length > 0;
  const isFirstTimeUser = !personalized && recommendations.some((r) => r.id === 'generic-assessment');

  return (
    <div className={isDark ? 'dark' : ''}>
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] dark:bg-none dark:bg-darkBg font-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

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
                <MdAutoAwesome className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-title font-bold text-heroBg dark:text-white leading-none">
                  Recommendations for You
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                  {personalized
                    ? `Personalized for ${user?.fullName?.split(' ')[0] || 'you'} based on your check-ins`
                    : 'General wellness suggestions to get you started'}
                  {personalized && generatedAt && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {' · '}Generated {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {hasData && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-2 transition-colors disabled:opacity-60"
              >
                <IoRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            )}
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={rec.id} recommendation={rec} index={i} />
              ))}
            </div>

            {isFirstTimeUser && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/survey')}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-2xl text-sm shadow-md shadow-primary/25 transition-colors"
              >
                Take Assessment <FaArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {/* Disclaimer */}
            <p className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              <IoShieldCheckmark className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 mt-0.5" />
              These recommendations are general wellness suggestions, not medical advice. If you
              are experiencing distress, please consult a qualified professional.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default RecommendationsPage;
