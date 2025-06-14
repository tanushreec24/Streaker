import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, onAuthStateChange, createProfile, getProfile } from '@/lib/auth';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  needsProfileSetup: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  const refreshProfile = async () => {
    if (!user) return;
    
    const { data, error } = await getProfile(user.id);
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    setProfile(data);
    
    // Check if profile needs setup (missing required fields)
    const needsSetup = !data?.full_name || !data?.username;
    setNeedsProfileSetup(needsSetup);
  };

  const handleSignOut = async () => {
    const { signOut } = await import('@/lib/auth');
    const { error } = await signOut();
    
    if (error) {
      toast.error('Error signing out');
      console.error('Sign out error:', error);
    } else {
      setUser(null);
      setProfile(null);
      setNeedsProfileSetup(false);
      toast.success('Signed out successfully');
    }
  };

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(setUser);

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        // Check if profile exists, create if not
        const { data: existingProfile, error: profileError } = await getProfile(user.id);
        
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await createProfile(user);
          
          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Error setting up your profile');
          } else {
            setProfile(newProfile);
            // New profile always needs setup
            setNeedsProfileSetup(true);
            toast.success('Welcome to Streaker! Let\'s set up your profile.');
          }
        } else if (existingProfile) {
          setProfile(existingProfile);
          
          // Check if existing profile needs setup
          const needsSetup = !existingProfile.full_name || !existingProfile.username;
          setNeedsProfileSetup(needsSetup);
        }
      } else {
        setProfile(null);
        setNeedsProfileSetup(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    needsProfileSetup,
    signOut: handleSignOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}