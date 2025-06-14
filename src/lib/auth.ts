import { supabase } from './supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  user?: User | null;
  error?: AuthError | null;
}

export const sendMagicLink = async (email: string): Promise<{ error?: AuthError | null }> => {
  // Always redirect to root, let the app handle routing based on auth state
  const redirectTo = `${window.location.origin}/`;
  
  console.log('Magic link redirect URL:', redirectTo);
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });
  
  return { error };
};

export const signOut = async (): Promise<{ error?: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};

// Profile management
export const createProfile = async (user: User) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email!,
      full_name: null, // Will be set during profile setup
      username: null, // Will be set during profile setup
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    .select()
    .single();

  return { data, error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};