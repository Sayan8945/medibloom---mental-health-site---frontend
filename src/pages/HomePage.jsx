import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Home from '../componenets/Home';
import Services from '../componenets/Services';
import Resources from '../componenets/Resources';
import WorkingSteps from '../componenets/WorkingSteps';
import SurveySection from '../componenets/SurveySection';
import ChatAi from '../componenets/ChatAi';
import Quotes from '../componenets/Quotes';
import Contact from '../componenets/Contact';
import Footer from '../componenets/Footer';
import ScrollToTop from '../componenets/ScrollToTop';
import { WellnessSidebarProvider, useWellnessSidebar } from '../components/WellnessSidebar/WellnessSidebarContext';
import TabletSidebar from '../components/WellnessSidebar/TabletSidebar';
import MobileSidebar from '../components/WellnessSidebar/MobileSidebar';
import MoodCheckInModal from '../mood/MoodCheckInModal';
import ProfileInfoModal from '../components/WellnessSidebar/UserMiniProfile/ProfileInfoModal';
import SettingsModal from '../components/WellnessSidebar/SettingsModal';

// Renders the md/tablet + <768px/mobile wellness sidebar variants below the
// hero (the lg+ desktop variant lives inside Home.jsx as the hero's 3rd
// grid column). Also owns the shared modals (check-in / profile / settings)
// so there is exactly one instance of each per page, regardless of which
// breakpoint's layout triggered them.
const WellnessSidebarBelowHero = () => {
  const sidebar = useWellnessSidebar();
  if (!sidebar.user) return null;

  return (
    <>
      <TabletSidebar {...sidebar} />
      <MobileSidebar {...sidebar} />

      <MoodCheckInModal
        isOpen={sidebar.checkInOpen}
        onClose={() => sidebar.setCheckInOpen(false)}
        initialEntry={sidebar.entry}
        isEditing={!!sidebar.entry}
        onSubmit={sidebar.onCheckInSubmit}
      />
      <ProfileInfoModal
        isOpen={sidebar.profileOpen}
        onClose={() => sidebar.setProfileOpen(false)}
        user={sidebar.user}
      />
      <SettingsModal
        isOpen={sidebar.settingsOpen}
        onClose={() => sidebar.setSettingsOpen(false)}
      />
    </>
  );
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // When the navbar sends us here from another page (e.g. survey/analytics)
  // it passes { scrollTo: sectionId } via router state — scroll to it once mounted.
  useEffect(() => {
    const sectionId = location?.state?.scrollTo;
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
    // Clear the state so refreshing / navigating back doesn't re-trigger the scroll
    navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate]);

  return (
    <WellnessSidebarProvider>
      <div className="font-primary overflow-x-hidden">
        <Home />
        <WellnessSidebarBelowHero />
        <Services />
        <Resources />
        <WorkingSteps />
        <SurveySection />
        <Quotes />
        <Contact />
        <Footer />
        <ChatAi />
        <ScrollToTop />
      </div>
    </WellnessSidebarProvider>
  );
};

export default HomePage;
