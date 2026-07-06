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

const HomePage = () => (
  <div className="font-primary overflow-x-hidden">
    <Home />
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
);

export default HomePage;
