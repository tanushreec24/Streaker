import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/pages/Login';
import { ProfileSetup } from '@/pages/ProfileSetup';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, needsProfileSetup } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center"
          >
            <Crown className="h-8 w-8 text-royal-900" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="royal-text text-xl font-bold">Loading Streaker</h2>
            <p className="text-gray-400">Preparing your royal experience...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (needsProfileSetup) {
    return <ProfileSetup />;
  }

  return <>{children}</>;
}