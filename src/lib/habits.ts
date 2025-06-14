import { supabase } from './supabase';
import type { Database } from './supabase';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitEntry = Database['public']['Tables']['habit_entries']['Row'];
type HabitInsert = Database['public']['Tables']['habits']['Insert'];
type HabitEntryInsert = Database['public']['Tables']['habit_entries']['Insert'];

// Habit CRUD operations
export const createHabit = async (habitData: Omit<HabitInsert, 'user_id'>) => {
  try {
    console.log('🚀 Starting habit creation process...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Auth error:', userError);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    if (!user) {
      console.error('❌ No user found');
      throw new Error('User not authenticated. Please sign in again.');
    }

    console.log('✅ User authenticated:', user.id);
    console.log('📝 Habit data to create:', habitData);

    // Prepare the habit data
    const habitToInsert = {
      ...habitData,
      user_id: user.id,
      emoji: habitData.emoji || '🎯',
      color: habitData.color || '#d4af37',
      reminder_enabled: habitData.reminder_enabled ?? true,
      active_days: habitData.active_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      target_count: habitData.target_count || 1,
    };

    console.log('📋 Final habit data:', habitToInsert);

    // Insert the habit
    const { data, error } = await supabase
      .from('habits')
      .insert(habitToInsert)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      // Provide more specific error messages
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your database permissions.');
      } else if (error.code === '23505') {
        throw new Error('A habit with this name already exists.');
      } else if (error.code === 'PGRST301') {
        throw new Error('Database connection error. Please try again.');
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    if (!data) {
      console.error('❌ No data returned from insert');
      throw new Error('Failed to create habit - no data returned');
    }

    console.log('✅ Habit created successfully:', data);
    return { data, error: null };
    
  } catch (error) {
    console.error('💥 Error in createHabit function:', error);
    
    // Return a structured error response
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'CREATE_HABIT_ERROR'
      }
    };
  }
};

export const getUserHabits = async () => {
  try {
    console.log('📋 Fetching user habits...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Auth error:', userError);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    if (!user) {
      console.error('❌ No user found');
      throw new Error('User not authenticated');
    }

    console.log('✅ User authenticated for habits fetch:', user.id);

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching habits:', error);
      throw new Error(`Failed to fetch habits: ${error.message}`);
    }

    console.log('✅ Habits fetched successfully:', data?.length || 0, 'habits');
    return { data, error: null };
    
  } catch (error) {
    console.error('💥 Error in getUserHabits:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'FETCH_HABITS_ERROR'
      }
    };
  }
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  try {
    console.log('📝 Updating habit:', habitId, updates);
    
    const { data, error } = await supabase
      .from('habits')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating habit:', error);
      throw new Error(`Failed to update habit: ${error.message}`);
    }

    console.log('✅ Habit updated successfully:', data);
    return { data, error: null };
    
  } catch (error) {
    console.error('💥 Error in updateHabit:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'UPDATE_HABIT_ERROR'
      }
    };
  }
};

export const deleteHabit = async (habitId: string) => {
  try {
    console.log('🗑️ Deleting habit:', habitId);
    
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);

    if (error) {
      console.error('❌ Error deleting habit:', error);
      throw new Error(`Failed to delete habit: ${error.message}`);
    }

    console.log('✅ Habit deleted successfully');
    return { error: null };
    
  } catch (error) {
    console.error('💥 Error in deleteHabit:', error);
    return { 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'DELETE_HABIT_ERROR'
      }
    };
  }
};

// Habit Entry (Logging) operations
export const getHabitEntries = async (habitId?: string, startDate?: string, endDate?: string) => {
  try {
    console.log('📊 Fetching habit entries...', { habitId, startDate, endDate });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('habit_entries')
      .select(`
        *,
        habits (
          id,
          name,
          emoji,
          color
        )
      `)
      .eq('user_id', user.id);

    if (habitId) {
      query = query.eq('habit_id', habitId);
    }

    if (startDate) {
      query = query.gte('completed_at', startDate);
    }

    if (endDate) {
      query = query.lte('completed_at', endDate);
    }

    const { data, error } = await query.order('completed_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching habit entries:', error);
      throw new Error(`Failed to fetch habit entries: ${error.message}`);
    }

    console.log('✅ Habit entries fetched:', data?.length || 0, 'entries');
    return { data, error: null };
    
  } catch (error) {
    console.error('💥 Error in getHabitEntries:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'FETCH_ENTRIES_ERROR'
      }
    };
  }
};

export const toggleHabitEntry = async (habitId: string, date: string) => {
  try {
    console.log('🔄 Toggling habit entry:', habitId, date);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // First, check if an entry already exists for this habit and date
    const { data: existingEntry, error: fetchError } = await supabase
      .from('habit_entries')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('completed_at', date)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if no entry exists
      console.error('❌ Error checking existing entry:', fetchError);
      throw new Error(`Failed to check existing entry: ${fetchError.message}`);
    }

    if (existingEntry) {
      // Entry exists, delete it (toggle off)
      const { error: deleteError } = await supabase
        .from('habit_entries')
        .delete()
        .eq('id', existingEntry.id);

      if (deleteError) {
        console.error('❌ Error deleting habit entry:', deleteError);
        throw new Error(`Failed to delete habit entry: ${deleteError.message}`);
      }

      console.log('✅ Habit entry deleted (toggled off)');
      return { data: null, error: null, action: 'deleted' };
    } else {
      // Entry doesn't exist, create it (toggle on)
      const { data, error } = await supabase
        .from('habit_entries')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_at: date,
          count: 1,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating habit entry:', error);
        throw new Error(`Failed to create habit entry: ${error.message}`);
      }

      console.log('✅ Habit entry created (toggled on)');
      return { data, error: null, action: 'created' };
    }
    
  } catch (error) {
    console.error('💥 Error in toggleHabitEntry:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'TOGGLE_ENTRY_ERROR'
      }, 
      action: 'error' 
    };
  }
};

export const getHabitStats = async (habitId: string) => {
  try {
    console.log('📈 Calculating habit stats for:', habitId);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get all entries for this habit
    const { data: entries, error } = await supabase
      .from('habit_entries')
      .select('completed_at')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching habit stats:', error);
      throw new Error(`Failed to fetch habit stats: ${error.message}`);
    }

    if (!entries || entries.length === 0) {
      console.log('📊 No entries found for habit, returning zero stats');
      return {
        data: {
          currentStreak: 0,
          longestStreak: 0,
          totalCompletions: 0,
          completionRate: 0,
        },
        error: null,
      };
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = entries.map(e => e.completed_at).sort();
    
    // Check if today or yesterday was completed to start counting streak
    const lastEntry = sortedDates[sortedDates.length - 1];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastEntry === today || lastEntry === yesterdayStr) {
      // Count backwards from the most recent entry
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - (sortedDates.length - 1 - i));
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (sortedDates[i] === expectedDateStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = entries.filter(e => new Date(e.completed_at) >= thirtyDaysAgo);
    const completionRate = Math.round((recentEntries.length / 30) * 100);

    const stats = {
      currentStreak,
      longestStreak,
      totalCompletions: entries.length,
      completionRate,
    };

    console.log('✅ Habit stats calculated:', stats);
    return { data: stats, error: null };
    
  } catch (error) {
    console.error('💥 Error in getHabitStats:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'STATS_ERROR'
      }
    };
  }
};

// Get habit entries for a specific month
export const getMonthlyHabitEntries = async (year: number, month: number) => {
  try {
    console.log('📅 Fetching monthly habit entries:', year, month);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    console.log('📅 Date range:', startDate, 'to', endDate);

    const { data, error } = await supabase
      .from('habit_entries')
      .select(`
        *,
        habits (
          id,
          name,
          emoji,
          color
        )
      `)
      .eq('user_id', user.id)
      .gte('completed_at', startDate)
      .lte('completed_at', endDate);

    if (error) {
      console.error('❌ Error fetching monthly habit entries:', error);
      throw new Error(`Failed to fetch monthly entries: ${error.message}`);
    }

    console.log('✅ Monthly entries fetched:', data?.length || 0, 'entries');
    return { data, error: null };
    
  } catch (error) {
    console.error('💥 Error in getMonthlyHabitEntries:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'MONTHLY_ENTRIES_ERROR'
      }
    };
  }
};