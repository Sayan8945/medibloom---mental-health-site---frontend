import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage          from './pages/HomePage';
import Login             from './pages/Login';
import SurveyPage        from './pages/SurveyPage';
import SurveyHistoryPage from './pages/SurveyHistoryPage';
import AnalyticsPage     from './pages/AnalyticsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import Layout            from './componenets/Layout';
import ProtectedRoute    from './componenets/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index         element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/survey"
              element={
                <ProtectedRoute>
                  <SurveyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <SurveyHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
