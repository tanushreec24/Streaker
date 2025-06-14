import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('🔍 Supabase Environment Check:');
console.log('URL exists:', !!supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);
console.log('URL value:', supabaseUrl);
console.log('Key preview:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING');

// Check if we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please add the following to your .env file:');
  console.error('VITE_SUPABASE_URL=https://dshsisqsgszskarcywog.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzaHNpc3FzZ3N6c2thcmN5d29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjA3ODEsImV4cCI6MjA2NTQ5Njc4MX0.lyKGcJx8wPuPtkNqOeqLQcM8kjqUeLg3eCdXIqQ8qok');
  
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection and check if tables exist
supabase.auth.getSession().then(async ({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connected successfully');
    console.log('Session exists:', !!data.session);
    if (data.session) {
      console.log('User ID:', data.session.user.id);
    }
    
    // Test if tables exist by trying to query them
    try {
      const { data: profilesTest, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (profilesError) {
        console.error('❌ Profiles table error:', profilesError.message);
        if (profilesError.code === 'PGRST301') {
          console.log('🔧 Tables exist but may need RLS policies or user permissions');
        }
      } else {
        console.log('✅ Profiles table exists and accessible');
      }
      
      const { data: habitsTest, error: habitsError } = await supabase
        .from('habits')
        .select('count')
        .limit(1);
      
      if (habitsError) {
        console.error('❌ Habits table error:', habitsError.message);
        if (habitsError.code === 'PGRST301') {
          console.log('🔧 Tables exist but may need RLS policies or user permissions');
        }
      } else {
        console.log('✅ Habits table exists and accessible');
      }
    } catch (err) {
      console.error('❌ Error testing tables:', err);
    }
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          emoji: string;
          color: string;
          reminder_time: string | null;
          reminder_enabled: boolean;
          active_days: string[];
          target_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          emoji?: string;
          color?: string;
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          active_days?: string[];
          target_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          emoji?: string;
          color?: string;
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          active_days?: string[];
          target_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_entries: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_at: string;
          count: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_at?: string;
          count?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_at?: string;
          count?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};