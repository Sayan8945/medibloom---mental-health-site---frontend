import MoodCheckInModal from '../../mood/MoodCheckInModal';
import ProfileInfoModal from './UserMiniProfile/ProfileInfoModal';
import SettingsModal from './SettingsModal';
import DesktopSidebar from './DesktopSidebar';
import TabletSidebar from './TabletSidebar';
import MobileSidebar from './MobileSidebar';
import { WellnessSidebarProvider, useWellnessSidebar } from './WellnessSidebarContext';

/**
 * Premium wellness sidebar — replaces the old standalone <TodayMoodWidget/>
 * card that used to sit below the hero section. Renders one of three
 * presentational layouts purely via Tailwind breakpoint classes
 * (DesktopSidebar / TabletSidebar / MobileSidebar), all driven by a single
 * shared data context so mood data is fetched once regardless of which
 * breakpoint is visible — no client-side media-query flicker, no duplicate
 * requests.
 *
 * Reuses existing APIs only (GET/POST/PUT /api/mood/*) and the existing
 * AuthContext — no new endpoints, no business logic changes.
 */
const WellnessSidebarContent = () => {
  const sidebar = useWellnessSidebar();

  if (!sidebar.user) return null;

  return (
    <>
      <DesktopSidebar {...sidebar} />
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

const WellnessSidebar = () => (
  <WellnessSidebarProvider>
    <WellnessSidebarContent />
  </WellnessSidebarProvider>
);

export default WellnessSidebar;
