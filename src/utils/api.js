import axios from 'axios';

/**
 * Axios instance pre-configured for the MediBloom backend.
 * withCredentials: true — sends the session cookie on every request.
 */
const api = axios.create({
  baseURL:         `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Global response interceptor — surface errors cleanly
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || 'Network error. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
