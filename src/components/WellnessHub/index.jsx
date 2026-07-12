import MoodCheckInModal from '../../mood/MoodCheckInModal';
import ProfileInfoModal from './ProfileInfoModal';
import HubTrigger from './HubTrigger';
import HubPanel from './HubPanel';
import HubSheet from './HubSheet';
import MoodReminderModal from './MoodReminderModal';
import { getMoodMeta } from '../../mood/moodConstants';
import { WellnessHubProvider, useWellnessHub } from './WellnessHubContext';

/**
 * Premium sliding Wellness Hub — replaces the old persistent right
 * sidebar. Mounted once, globally, in Layout.jsx so it's available on
 * every route (not just the homepage). Hidden by default; opened via the
 * always-visible floating HubTrigger.
 *
 * Reuses existing APIs only (GET/POST/PUT /api/mood/*, GET /api/analytics/*)
 * and the existing AuthContext — no new endpoints, no business logic
 * changes, no protected-route/session handling beyond what already exists.
 *
 * Settings now lives in the navbar's user dropdown (see Navbar.jsx) rather
 * than as a hub quick-link — that shared <SettingsModal/> instance covers
 * both entry points.
 */
const WellnessHubContent = () => {
  const hub = useWellnessHub();
  const moodMeta = hub.entry ? getMoodMeta(hub.entry.mood) : null;

  return (
    <>
      <HubTrigger
        isOpen={hub.isOpen}
        onClick={hub.toggle}
        hasUnseenReminder={hub.reminderOpen}
        showStats={!!hub.user && !hub.loading}
        wellnessScore={hub.wellnessScores?.wellness ?? null}
        streak={hub.analytics?.streaks?.current ?? 0}
        moodEmoji={moodMeta?.emoji ?? null}
      />

      <HubPanel {...hub} />
      <HubSheet {...hub} />

      {hub.user && (
        <>
          <MoodCheckInModal
            isOpen={hub.checkInOpen}
            onClose={() => hub.setCheckInOpen(false)}
            initialEntry={hub.entry}
            isEditing={!!hub.entry}
            onSubmit={hub.onCheckInSubmit}
          />

          <ProfileInfoModal
            isOpen={hub.profileOpen}
            onClose={() => hub.setProfileOpen(false)}
            user={hub.user}
          />

          <MoodReminderModal
            isOpen={hub.reminderOpen}
            onCheckIn={hub.startCheckInFromReminder}
            onRemindLater={hub.dismissReminder}
          />
        </>
      )}
    </>
  );
};

const WellnessHub = () => (
  <WellnessHubProvider>
    <WellnessHubContent />
  </WellnessHubProvider>
);

export default WellnessHub;
