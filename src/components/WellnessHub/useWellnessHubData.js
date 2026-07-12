import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

// ── Daily mood-check reminder cooldown keys ─────────────────────
// sessionStorage → "don't show again this browser session" (tab lifetime).
// localStorage   → "if dismissed, wait 6h before the reminder can show again".
const REMINDER_SESSION_KEY  = 'medibloom_mood_reminder_shown_session';
const REMINDER_DISMISS_KEY  = 'medibloom_mood_reminder_dismissed_until';
const REMINDER_DISMISS_MS   = 6 * 60 * 60 * 1000; // 6 hours
const REMINDER_SHOW_DELAY   = 1600; // ms — let the page settle first

/**
 * Single source of truth for the Wellness Hub — panel open/close state,
 * mood + analytics data, the daily check-in reminder, and modal state.
 * Reuses existing APIs only: GET /api/mood/today, GET /api/mood/analytics,
 * GET /api/analytics/trends, GET /api/analytics/summary, POST/PUT /api/mood,
 * and AuthContext's `user`/`logout`/`loginWithGoogle`/`checkAuth`. No new
 * endpoints, no business-logic changes — purely UI-state glue.
 */
export function useWellnessHubData() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, loginWithGoogle, checkAuth } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [entry, setEntry] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [wellnessScores, setWellnessScores] = useState(null); // { wellness, stress, sleep }
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine);

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  // ── Offline detection ──────────────────────────────────────────
  useEffect(() => {
    const goOnline  = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const loadData = useCallback(async () => {
    setError(null);
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

      // Prefer the mood check-in insights (day-to-day cadence); fall back
      // to the survey-based summary insights if too few check-ins exist yet.
      const moodInsight = analyticsRes.data?.insights?.[0];
      const summaryInsight = summaryRes?.data?.insights?.[0];
      setAiInsight(moodInsight || summaryInsight || null);
    } catch (err) {
      // Session expiration: a 401 means the cookie/session died server-side
      // — re-sync AuthContext so the hub gracefully falls back to the
      // signed-out view instead of showing a stale/broken authenticated UI.
      if (err.message?.toLowerCase().includes('authentication required')) {
        await checkAuth();
      }
      setError(err.message || 'Could not load your wellness data.');
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    if (user) loadData();
    else setLoading(false);
  }, [user, loadData]);

  // ── Daily mood check-in reminder ─────────────────────────────────
  // Shows once per browser session; if dismissed, waits 6h before it can
  // show again; never shows again once today's entry exists.
  useEffect(() => {
    if (!user || loading || entry) return;
    if (sessionStorage.getItem(REMINDER_SESSION_KEY)) return;

    const dismissedUntil = Number(localStorage.getItem(REMINDER_DISMISS_KEY) || 0);
    if (Date.now() < dismissedUntil) return;

    const t = setTimeout(() => {
      setReminderOpen(true);
      sessionStorage.setItem(REMINDER_SESSION_KEY, 'true');
    }, REMINDER_SHOW_DELAY);
    return () => clearTimeout(t);
  }, [user, loading, entry]);

  const dismissReminder = () => {
    localStorage.setItem(REMINDER_DISMISS_KEY, String(Date.now() + REMINDER_DISMISS_MS));
    setReminderOpen(false);
  };

  const startCheckInFromReminder = () => {
    setReminderOpen(false);
    setCheckInOpen(true);
  };

  const handleCheckInSubmit = async (payload) => {
    if (entry) {
      const res = await api.put(`/mood/${entry._id}`, payload);
      setEntry(res.data.entry);
    } else {
      const res = await api.post('/mood', payload);
      setEntry(res.data.entry);
    }
    setCheckInOpen(false);
    localStorage.removeItem(REMINDER_DISMISS_KEY); // completed today — no more nudges
    loadData(); // refresh streak/analytics after a new/updated check-in
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  // Actions that don't map to a route — open a modal or scroll to an
  // existing homepage section instead (mirrors Navbar.jsx's handleNavClick).
  const scrollToContact = () => {
    setIsOpen(false);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/', { state: { scrollTo: 'contact' } });
  };

  const handleLinkAction = (action) => {
    if (action === 'profile') setProfileOpen(true);
    else if (action === 'settings') setSettingsOpen(true);
    else if (action === 'contact') scrollToContact();
  };

  // Reuses the existing floating ChatAi widget (its own internal state,
  // now mounted globally in Layout.jsx) instead of duplicating chat UI —
  // just triggers its toggle button.
  const openChatAssistant = () => {
    setIsOpen(false);
    document.getElementById('chatbot-toggler')?.click();
  };

  const handleQuickAction = (action) => {
    if (action === 'assessment') handleNavigate('/survey');
    else if (action === 'checkin') setCheckInOpen(true);
    else if (action === 'chat') openChatAssistant();
    else if (action === 'appointment') scrollToContact();
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    toast.success('You have been logged out successfully.', {
      icon: '👋',
      style: { borderRadius: '12px', background: '#0e1122', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
    navigate('/');
  };

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),

    user,
    authLoading,
    loading,
    error,
    isOffline,
    entry,
    analytics,
    wellnessScores,
    aiInsight,

    reminderOpen,
    dismissReminder,
    startCheckInFromReminder,

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
    onRetry: loadData,
    loginWithGoogle,
  };
}
