import { createContext, useContext } from 'react';
import { useWellnessSidebarData } from './useWellnessSidebarData';

const WellnessSidebarContext = createContext(null);

/**
 * Wraps the homepage so the Desktop/Tablet/Mobile sidebar variants (which
 * all mount simultaneously and toggle visibility purely via Tailwind
 * breakpoints) share a single data fetch instead of each calling
 * useWellnessSidebarData() independently — avoids duplicate /api/mood
 * requests and keeps modal open/close state in sync across breakpoints.
 */
export const WellnessSidebarProvider = ({ children }) => {
  const value = useWellnessSidebarData();
  return (
    <WellnessSidebarContext.Provider value={value}>
      {children}
    </WellnessSidebarContext.Provider>
  );
};

export const useWellnessSidebar = () => {
  const ctx = useContext(WellnessSidebarContext);
  if (!ctx) throw new Error('useWellnessSidebar must be used inside WellnessSidebarProvider');
  return ctx;
};
