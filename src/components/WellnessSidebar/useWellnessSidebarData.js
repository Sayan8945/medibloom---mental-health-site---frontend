import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

/**
 * Single source of truth for the wellness sidebar's data + handlers, shared
 * across the Desktop/Tablet/Mobile presentational variants so the mood
 * check-in and analytics are only fetched once per page load regardless of
 * which breakpoint is actually visible.
 *
 * Reuses existing APIs only: GET /api/mood/today, GET /api/mood/analytics,
 * POST/PUT /api/mood, and AuthContext's `user`/`logout`. No new endpoints
 * and no changes to business logic — this hook is purely UI-state glue.
 */
export function useWellnessSidebarData() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [entry, setEntry] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [wellnessScores, setWellnessScores] = useState(null); // { wellness, stress, sleep }
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [todayRes, analyticsRes, trendsRes, summaryRes] = await Promise.all([
        api.get('/mood/today'),
        api.get('/mood/analytics'),
        // Survey-based radar snapshot — reused only for its latest
        // Wellness/Stress/Sleep values, no new endpoint required.
        api.get('/analytics/trends').catch(() => null),
        api.get('/analytics/summary').catch(() => null),
      ]);
      setEntry(todayRes.data.entry);
      setAnalytics(analyticsRes.data);

      const radar = trendsRes?.data?.radar;
      if (radar?.length) {
        const byDim = Object.fromEntries(radar.map((r) => [r.dimension, r.value]));
        setWellnessScores({
          wellness: byDim.Wellness ?? null,
          stress: byDim.Stress ?? null,
          sleep: byDim.Sleep ?? null,
        });
      } else {
        setWellnessScores(null);
      }

      // Prefer the mood check-in insights (day-to-day, matches the sidebar's
      // "Today's Mood" cadence); fall back to the survey-based summary
      // insights if the user hasn't checked in enough days yet.
      const moodInsight = analyticsRes.data?.insights?.[0];
      const summaryInsight = summaryRes?.data?.insights?.[0];
      setAiInsight(moodInsight || summaryInsight || null);
    } catch {
      // Non-fatal — the mood card simply renders its "not checked in" state.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
    else setLoading(false);
  }, [user, loadData]);

  const handleCheckInSubmit = async (payload) => {
    if (entry) {
      const res = await api.put(`/mood/${entry._id}`, payload);
      setEntry(res.data.entry);
    } else {
      const res = await api.post('/mood', payload);
      setEntry(res.data.entry);
    }
    setCheckInOpen(false);
    loadData(); // refresh streak/analytics after a new/updated check-in
  };

  const handleNavigate = (path) => navigate(path);

  // Actions that don't map to a route — open a modal or scroll to an
  // existing homepage section instead (mirrors Navbar.jsx's handleNavClick).
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/', { state: { scrollTo: 'contact' } });
  };

  const handleLinkAction = (action) => {
    if (action === 'profile') setProfileOpen(true);
    else if (action === 'settings') setSettingsOpen(true);
    else if (action === 'contact') scrollToContact();
  };

  // Reuses the existing floating ChatAi widget (its own internal state)
  // instead of duplicating chat UI — just triggers its toggle button.
  const openChatAssistant = () => {
    document.getElementById('chatbot-toggler')?.click();
  };

  const handleQuickAction = (action) => {
    if (action === 'assessment') navigate('/survey');
    else if (action === 'checkin') setCheckInOpen(true);
    else if (action === 'chat') openChatAssistant();
    else if (action === 'appointment') scrollToContact();
  };

  const handleLogout = async () => {
    await logout();
    toast.success('You have been logged out successfully.', {
      icon: '👋',
      style: { borderRadius: '12px', background: '#0e1122', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
    navigate('/');
  };

  return {
    user,
    loading,
    entry,
    analytics,
    wellnessScores,
    aiInsight,
    checkInOpen, setCheckInOpen,
    profileOpen, setProfileOpen,
    settingsOpen, setSettingsOpen,
    onOpenCheckIn: () => setCheckInOpen(true),
    onOpenProfile: () => setProfileOpen(true),
    onNavigate: handleNavigate,
    onLinkAction: handleLinkAction,
    onQuickAction: handleQuickAction,
    onLogout: handleLogout,
    onCheckInSubmit: handleCheckInSubmit,
  };
}
