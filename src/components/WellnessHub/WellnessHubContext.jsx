import { createContext, useContext } from 'react';
import { useWellnessHubData } from './useWellnessHubData';

const WellnessHubContext = createContext(null);

/**
 * Wraps the whole app (see Layout.jsx) so the floating trigger button and
 * the sliding panel share a single data fetch + open/close state,
 * regardless of which route is currently active. This is what lets the
 * hub stay mounted globally instead of being tied to the homepage.
 */
export const WellnessHubProvider = ({ children }) => {
  const value = useWellnessHubData();
  return (
    <WellnessHubContext.Provider value={value}>
      {children}
    </WellnessHubContext.Provider>
  );
};

export const useWellnessHub = () => {
  const ctx = useContext(WellnessHubContext);
  if (!ctx) throw new Error('useWellnessHub must be used inside WellnessHubProvider');
  return ctx;
};
