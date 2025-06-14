import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from './Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserHabits, getMonthlyHabitEntries, toggleHabitEntry, getHabitStats } from '@/lib/habits';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  streak: number;
}

interface HabitEntry {
  id: string;
  habit_id: string;
  completed_at: string;
  count: number;
}

export function HabitCalendarView() {
  const { user } = useAuth();
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  // Load habits and entries
  useEffect(() => {
    if (!user) return;
    loadHabitsAndEntries();
  }, [user, currentDate]);

  // Update completed dates when habit selection or entries change
  useEffect(() => {
    if (selectedHabitId && habitEntries.length > 0) {
      const dates = habitEntries
        .filter(entry => entry.habit_id === selectedHabitId)
        .map(entry => entry.completed_at);
      setCompletedDates(new Set(dates));
    } else {
      setCompletedDates(new Set());
    }
  }, [selectedHabitId, habitEntries]);

  const loadHabitsAndEntries = async () => {
    try {
      setLoading(true);

      // Load habits
      const { data: habitsData, error: habitsError } = await getUserHabits();
      if (habitsError) {
        console.error('Error loading habits:', habitsError);
        toast.error('Failed to load habits');
        return;
      }

      // Load habit stats and create habit objects
      const habitsWithStats = await Promise.all(
        (habitsData || []).map(async (habit) => {
          const { data: stats } = await getHabitStats(habit.id);
          return {
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            color: habit.color,
            streak: stats?.currentStreak || 0,
          };
        })
      );

      setHabits(habitsWithStats);

      // Auto-select first habit if none selected
      if (!selectedHabitId && habitsWithStats.length > 0) {
        setSelectedHabitId(habitsWithStats[0].id);
      }

      // Load entries for current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const { data: entriesData, error: entriesError } = await getMonthlyHabitEntries(year, month);
      
      if (entriesError) {
        console.error('Error loading habit entries:', entriesError);
        toast.error('Failed to load habit entries');
        return;
      }

      setHabitEntries(entriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateToggle = async (date: string) => {
    if (!selectedHabitId) {
      toast.error('Please select a habit first');
      return;
    }

    try {
      const { error, action } = await toggleHabitEntry(selectedHabitId, date);
      
      if (error) {
        console.error('Error toggling habit entry:', error);
        toast.error('Failed to update habit entry');
        return;
      }

      // Update local state
      const newCompletedDates = new Set(completedDates);
      if (action === 'created') {
        newCompletedDates.add(date);
        toast.success('Habit marked as complete!');
      } else {
        newCompletedDates.delete(date);
        toast.success('Habit marked as incomplete');
      }
      setCompletedDates(newCompletedDates);

      // Reload data to update streaks
      await loadHabitsAndEntries();
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const calculateCompletionRate = () => {
    if (!selectedHabitId || completedDates.size === 0) return 0;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const completedCount = completedDates.size;
    return Math.round((completedCount / daysInMonth) * 100);
  };

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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="royal-text text-3xl font-bold">Calendar View</h1>
          <p className="text-gray-400">Track your habits and visualize your progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-gold-500">No Habits to Track Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-white mb-2">Create habits to see your calendar</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Once you create habits, you'll see a beautiful calendar view where you can 
                  track your daily progress and visualize your streaks.
                </p>
                <Button 
                  onClick={() => window.location.href = '#habits'}
                  className="gold-gradient text-royal-900 hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Habit
                </Button>
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
        <h1 className="royal-text text-3xl font-bold">Calendar View</h1>
        <p className="text-gray-400">Track your habits and visualize your progress</p>
      </motion.div>

      {/* Habit Selection */}
      <Card className="glass border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-gold-500 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Select Habit to View</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedHabitId === habit.id ? "default" : "outline"}
                  className={cn(
                    "w-full h-auto p-4 flex flex-col items-center space-y-2",
                    selectedHabitId === habit.id
                      ? "gold-gradient text-royal-900"
                      : "border-gold-500/30 text-gray-300 hover:bg-gold-500/10"
                  )}
                  onClick={() => setSelectedHabitId(habit.id)}
                >
                  <div className="text-2xl">{habit.emoji}</div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{habit.name}</div>
                    <div className="flex items-center space-x-1 text-xs opacity-75">
                      <span>{habit.streak} days</span>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Habit Stats */}
      {selectedHabit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="glass border-gold-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gold-500">{selectedHabit.streak}</div>
              <div className="text-sm text-gray-400">Current Streak</div>
            </CardContent>
          </Card>
          <Card className="glass border-gold-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gold-500">{completedDates.size}</div>
              <div className="text-sm text-gray-400">Days This Month</div>
            </CardContent>
          </Card>
          <Card className="glass border-gold-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gold-500">{calculateCompletionRate()}%</div>
              <div className="text-sm text-gray-400">Completion Rate</div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Calendar
          selectedHabitId={selectedHabitId}
          completedDates={completedDates}
          onDateToggle={handleDateToggle}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      </motion.div>

      {/* Current Habit Info */}
      {selectedHabit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-gold-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: selectedHabit.color + '20' }}
                  >
                    {selectedHabit.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedHabit.name}</h3>
                    <p className="text-sm text-gray-400">Click on calendar days to toggle completion</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-gold-500/20 text-gold-500">
                  {selectedHabit.streak} day streak
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}