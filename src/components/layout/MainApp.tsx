import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Dashboard } from '@/pages/Dashboard';
import { Habits } from '@/pages/Habits';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Pomodoro } from '@/pages/Pomodoro';

const pages = {
  dashboard: Dashboard,
  habits: Habits,
  analytics: Analytics,
  pomodoro: Pomodoro,
  settings: Settings,
};

export function MainApp() {
  const location = useLocation();
  
  // Determine current page from URL path or default to dashboard
  const getPageFromPath = (pathname: string) => {
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/habits')) return 'habits';
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/pomodoro')) return 'pomodoro';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard'; // Default fallback
  };

  const [currentPage, setCurrentPage] = useState(() => getPageFromPath(location.pathname));

  const PageComponent = pages[currentPage as keyof typeof pages];

  // Update URL when page changes (optional - for better UX)
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Optionally update URL without full navigation
    const newPath = page === 'dashboard' ? '/' : `/${page}`;
    window.history.pushState(null, '', newPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800">
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}