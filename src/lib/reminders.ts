import { supabase } from './supabase';

// Test function to manually trigger habit reminders
export const triggerHabitReminders = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('send-habit-reminders', {
      body: { manual: true }
    });

    if (error) {
      console.error('Error triggering reminders:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error triggering reminders:', error);
    return { success: false, error: error.message };
  }
};

// Get reminder statistics
export const getReminderStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's habits with reminders enabled
    const { data: habits, error } = await supabase
      .from('habits')
      .select('id, name, reminder_enabled, reminder_time, active_days')
      .eq('user_id', user.id)
      .eq('reminder_enabled', true);

    if (error) {
      console.error('Error fetching reminder stats:', error);
      return { data: null, error };
    }

    // Calculate next reminder time
    const now = new Date();
    const nextReminder = habits?.reduce((earliest, habit) => {
      if (!habit.reminder_time) return earliest;
      
      const [hours, minutes] = habit.reminder_time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);
      
      // If reminder time has passed today, set for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }
      
      return !earliest || reminderTime < earliest ? reminderTime : earliest;
    }, null as Date | null);

    return {
      data: {
        totalHabits: habits?.length || 0,
        nextReminder,
        habits: habits || [],
      },
      error: null,
    };
  } catch (error) {
    console.error('Error getting reminder stats:', error);
    return { data: null, error };
  }
};