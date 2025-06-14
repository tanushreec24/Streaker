import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Info, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserHabits, updateHabit } from '@/lib/habits';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  reminder_enabled: boolean;
  reminder_time: string | null;
  active_days: string[];
  streak?: number;
}

interface ReminderSettingsProps {
  onCreateHabit?: () => void;
}

export function ReminderSettings({ onCreateHabit }: ReminderSettingsProps) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const { data, error } = await getUserHabits();
      
      if (error) {
        console.error('Error loading habits:', error);
        toast.error('Failed to load habits');
        return;
      }

      setHabits(data || []);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    try {
      setUpdating(habitId);
      
      const { error } = await updateHabit(habitId, {
        reminder_enabled: !habit.reminder_enabled,
        // Set default reminder time if enabling and none exists
        reminder_time: !habit.reminder_enabled && !habit.reminder_time ? '09:00' : habit.reminder_time,
      });

      if (error) {
        console.error('Error updating habit:', error);
        toast.error('Failed to update reminder setting');
        return;
      }

      // Update local state
      setHabits(prev => prev.map(h => 
        h.id === habitId 
          ? { 
              ...h, 
              reminder_enabled: !h.reminder_enabled,
              reminder_time: !h.reminder_enabled && !h.reminder_time ? '09:00' : h.reminder_time,
            }
          : h
      ));

      toast.success(
        !habit.reminder_enabled 
          ? 'Reminder enabled! 🔔' 
          : 'Reminder disabled'
      );
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder setting');
    } finally {
      setUpdating(null);
    }
  };

  const handleTimeChange = async (habitId: string, newTime: string) => {
    try {
      setUpdating(habitId);
      
      const { error } = await updateHabit(habitId, {
        reminder_time: newTime,
      });

      if (error) {
        console.error('Error updating reminder time:', error);
        toast.error('Failed to update reminder time');
        return;
      }

      // Update local state
      setHabits(prev => prev.map(h => 
        h.id === habitId 
          ? { ...h, reminder_time: newTime }
          : h
      ));

      toast.success('Reminder time updated! ⏰');
    } catch (error) {
      console.error('Error updating reminder time:', error);
      toast.error('Failed to update reminder time');
    } finally {
      setUpdating(null);
    }
  };

  const handleCreateHabit = () => {
    if (onCreateHabit) {
      onCreateHabit();
    }
  };

  const enabledReminders = habits.filter(h => h.reminder_enabled).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </div>
    );
  }

  // Show empty state for new users
  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="royal-text text-3xl font-bold mb-2">Reminder Settings</h1>
          <p className="text-gray-400">Configure when you want to be reminded about your habits</p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/20" role="region" aria-labelledby="no-habits-title">
            <CardHeader>
              <CardTitle id="no-habits-title" className="text-gold-500">No Habits to Set Reminders For</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4" role="img" aria-label="Bell emoji">🔔</div>
                <h3 className="text-xl font-semibold text-white mb-2">Create habits first</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Once you create some habits, you'll be able to set up personalized reminders 
                  to help you stay on track with your daily routines.
                </p>
                <Button 
                  onClick={handleCreateHabit}
                  className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                  aria-label="Create your first habit to set up reminders"
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Your First Habit
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-blue-500/20 bg-blue-500/5" role="note" aria-labelledby="reminder-info">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p id="reminder-info" className="text-blue-300 font-medium text-sm">Daily reminders help you stay on track</p>
                  <p className="text-blue-400/80 text-xs mt-1">
                    Enable notifications for habits you want to be reminded about. 
                    You can set different times for each habit based on when you prefer to do them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="royal-text text-3xl font-bold mb-2">Reminder Settings</h1>
        <p className="text-gray-400">Configure when you want to be reminded about your habits</p>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-gold-500/20" role="region" aria-labelledby="reminder-summary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg gold-gradient">
                  <Bell className="h-6 w-6 text-royal-900" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="reminder-summary" className="text-lg font-semibold text-white">Active Reminders</h3>
                  <p className="text-sm text-gray-400">
                    {enabledReminders} of {habits.length} habits have reminders enabled
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-gold-500/20 text-gold-500 text-lg px-3 py-1">
                {enabledReminders}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass border-blue-500/20 bg-blue-500/5" role="note" aria-labelledby="reminder-help">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p id="reminder-help" className="text-blue-300 font-medium text-sm">Daily email reminders sent at 9 AM UTC</p>
                <p className="text-blue-400/80 text-xs mt-1">
                  Enable reminders for habits you want to be notified about. We'll send you a beautiful email 
                  each morning with your habits for the day. You can set custom reminder times for each habit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Habits List */}
      <div className="space-y-4" role="list" aria-label="Habit reminder settings">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            role="listitem"
          >
            <Card className={`glass transition-all duration-300 ${
              habit.reminder_enabled 
                ? 'border-gold-500/30 bg-gold-500/5' 
                : 'border-gold-500/20'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Habit Info */}
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl" role="img" aria-label={`${habit.name} icon`}>{habit.emoji}</div>
                    <div>
                      <h3 className="font-semibold text-white">{habit.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span aria-label={`Active on ${habit.active_days.length} days`}>
                          {habit.active_days.length} days/week
                        </span>
                        {habit.reminder_enabled && habit.reminder_time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span aria-label={`Reminder time: ${habit.reminder_time}`}>{habit.reminder_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Time Picker */}
                    <div className={`transition-all duration-300 ${
                      habit.reminder_enabled ? 'opacity-100' : 'opacity-40'
                    }`}>
                      <Label htmlFor={`time-${habit.id}`} className="sr-only">
                        Reminder time for {habit.name}
                      </Label>
                      <Input
                        id={`time-${habit.id}`}
                        type="time"
                        value={habit.reminder_time || '09:00'}
                        onChange={(e) => handleTimeChange(habit.id, e.target.value)}
                        disabled={!habit.reminder_enabled || updating === habit.id}
                        className="w-24 glass border-gold-500/20 focus:border-gold-500/40 text-white text-sm focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                        aria-describedby={`time-help-${habit.id}`}
                      />
                      <div id={`time-help-${habit.id}`} className="sr-only">
                        Set the time when you want to be reminded about {habit.name}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center space-x-3">
                      <Label 
                        htmlFor={`reminder-${habit.id}`} 
                        className="text-sm text-gray-400 cursor-pointer"
                      >
                        {habit.reminder_enabled ? 'On' : 'Off'}
                      </Label>
                      <div className="relative">
                        <Switch
                          id={`reminder-${habit.id}`}
                          checked={habit.reminder_enabled}
                          onCheckedChange={() => handleToggleReminder(habit.id)}
                          disabled={updating === habit.id}
                          className="data-[state=checked]:bg-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                          aria-describedby={`switch-help-${habit.id}`}
                        />
                        {updating === habit.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-3 w-3 animate-spin text-gold-500" />
                          </div>
                        )}
                      </div>
                      <div id={`switch-help-${habit.id}`} className="sr-only">
                        Toggle reminder notifications for {habit.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-gold-500/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {habit.reminder_enabled ? 'Reminder active' : 'No reminder set'}
                    </span>
                    {habit.reminder_enabled && habit.reminder_time && (
                      <span className="text-gold-500 font-medium">
                        Daily at {habit.reminder_time}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass border-gray-500/20 bg-gray-500/5" role="note" aria-labelledby="reminder-tip">
          <CardContent className="p-4">
            <p id="reminder-tip" className="text-gray-400 text-sm text-center">
              💡 <strong>Tip:</strong> Reminders are sent daily at 9 AM UTC. Set individual reminder times 
              to customize when you prefer to do each habit. We'll include all your enabled habits in one beautiful email.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}