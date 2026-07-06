import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * /login is no longer a standalone form page.
 * Auth is handled via the Navbar LoginModal (Google OAuth).
 * This route just redirects appropriately.
 */
const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Already signed in → go home; otherwise go home and let the navbar handle login
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate]);

  return null;
};

export default Login;
