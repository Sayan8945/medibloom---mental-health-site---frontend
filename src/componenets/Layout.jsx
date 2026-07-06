import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => (
  <div className="min-h-screen bg-heroBg">
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
  </div>
);

export default Layout;
