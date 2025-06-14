import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { MainApp } from '@/components/layout/MainApp';
import { PublicHabit } from '@/pages/PublicHabit';
import { ProfileSetup } from '@/pages/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public habit sharing route */}
          <Route path="/u/:username/:habitName" element={<PublicHabit />} />
          
          {/* Profile setup route (accessible when authenticated but profile incomplete) */}
          <Route path="/setup" element={<ProfileSetup />} />
          
          {/* Protected main app routes - catch all other routes */}
          <Route path="*" element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;