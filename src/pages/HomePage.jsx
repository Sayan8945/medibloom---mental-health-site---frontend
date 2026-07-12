import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Home from '../componenets/Home';
import Services from '../componenets/Services';
import Resources from '../componenets/Resources';
import WorkingSteps from '../componenets/WorkingSteps';
import SurveySection from '../componenets/SurveySection';
import Quotes from '../componenets/Quotes';
import Contact from '../componenets/Contact';
import Footer from '../componenets/Footer';
import ScrollToTop from '../componenets/ScrollToTop';

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
    <div className="font-primary overflow-x-hidden">
      <Home />
      <Services />
      <Resources />
      <WorkingSteps />
      <SurveySection />
      <Quotes />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
