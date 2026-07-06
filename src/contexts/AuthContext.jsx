import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AuthContext = createContext(null);

const toastStyle = {
  borderRadius: '14px',
  background: '#0e1122',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '14px',
  padding: '12px 16px',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.authenticated ? res.data.user : null);
      return res.data.authenticated ? res.data.user : null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle ?auth=success / ?auth=failed redirect back from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('auth') === 'success') {
      window.history.replaceState({}, '', window.location.pathname);
      checkAuth().then((loggedInUser) => {
        if (loggedInUser) {
          const firstName = loggedInUser.fullName?.split(' ')[0] || 'there';
          toast.success(`Welcome back, ${firstName}! 👋`, {
            style: toastStyle,
            iconTheme: { primary: '#06a055', secondary: '#fff' },
            duration: 4000,
          });
        }
      });
    }

    if (params.get('auth') === 'failed') {
      window.history.replaceState({}, '', window.location.pathname);
      toast.error('Sign in was cancelled or failed. Please try again.', {
        style: toastStyle,
        iconTheme: { primary: '#f43f5e', secondary: '#fff' },
        duration: 4000,
      });
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    setUser(null);
  }, []);

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
