import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ChatAi from './ChatAi';
import WellnessHub from '../components/WellnessHub';

// WellnessHub + ChatAi are mounted globally here (not per-page) so the
// floating trigger, sliding panel, and AI assistant are available on
// every route — survey, analytics, mood history, etc — not just the
// homepage.
const Layout = () => (
  <div className="min-h-screen bg-heroBg">
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <WellnessHub />
    <ChatAi />
  </div>
);

export default Layout;
