import ProfileHeader from './ProfileHeader';
import TodaysMoodCard from './TodaysMoodCard';
import QuickActions from './QuickActions';
import QuickNav from './QuickNav';
import AIInsightCard from './AIInsightCard';
import SignedOutGate from './SignedOutGate';
import { HubSkeleton, HubError, OfflineBanner } from './HubStates';

/**
 * Shared body content rendered inside both the desktop/tablet sliding
 * panel and the mobile bottom sheet — keeps the two shells purely about
 * layout/animation while this owns the actual Wellness Hub sections.
 */
const HubContent = (hub) => {
  const {
    user, authLoading, loading, error, isOffline,
    entry, analytics, wellnessScores, aiInsight,
    onOpenCheckIn, onOpenProfile, onNavigate, onLinkAction, onQuickAction, onLogout,
    onRetry, loginWithGoogle,
  } = hub;

  if (authLoading) return <HubSkeleton />;

  // Never show private data or protected content to signed-out users.
  if (!user) return <SignedOutGate onLogin={loginWithGoogle} />;

  return (
    <div className="space-y-5">
      {isOffline && <OfflineBanner />}

      {loading ? (
        <HubSkeleton />
      ) : error && !entry && !analytics ? (
        <HubError message={error} onRetry={onRetry} />
      ) : (
        <>
          <ProfileHeader user={user} onOpenProfile={onOpenProfile} wellnessScores={wellnessScores} />

          <TodaysMoodCard
            loading={false}
            entry={entry}
            analytics={analytics}
            onOpenCheckIn={onOpenCheckIn}
            onNavigate={onNavigate}
          />

          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1">
              Quick Actions
            </p>
            <QuickActions onAction={onQuickAction} />
          </div>

          <div className="space-y-1 border-t border-white/10 pt-4">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3.5 mb-1">
              Quick Navigation
            </p>
            <QuickNav onNavigate={onNavigate} onAction={onLinkAction} onLogout={onLogout} />
          </div>

          {aiInsight && <AIInsightCard insight={aiInsight} />}
        </>
      )}
    </div>
  );
};

export default HubContent;
