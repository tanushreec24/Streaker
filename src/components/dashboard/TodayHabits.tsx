import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitCard } from './HabitCard';
import { StreakCelebration } from '@/components/celebrations/StreakCelebration';
import { useStreakCelebration } from '@/hooks/useStreakCelebration';
import { AddEditHabitModal } from '@/components/habits/AddEditHabitModal';
import { getUserHabits, getHabitEntries, toggleHabitEntry, getHabitStats, createHabit } from '@/lib/habits';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completed: boolean;
  progress: number;
  emoji: string;
  color: string;
}

export function TodayHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate current streak (this would come from your habit data)
  const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0);

  // Use streak celebration hook
  const { showCelebration, celebrationStreak, hideCelebration, triggerCelebration } = useStreakCelebration({
    currentStreak,
    onMilestone: (streak) => {
      console.log(`Milestone reached: ${streak} days!`);
    }
  });

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading habits for user:', user?.id);
      
      // Get user's habits
      const { data: habitsData, error: habitsError } = await getUserHabits();
      if (habitsError) {
        console.error('❌ Error loading habits:', habitsError);
        setError(`Failed to load habits: ${habitsError.message}`);
        toast.error(`Failed to load habits: ${habitsError.message}`);
        return;
      }

      if (!habitsData || habitsData.length === 0) {
        console.log('📝 No habits found for user');
        setHabits([]);
        return;
      }

      console.log('✅ Loaded habits:', habitsData.length, 'habits');

      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Get today's entries for all habits
      const { data: entriesData, error: entriesError } = await getHabitEntries(undefined, today, today);
      if (entriesError) {
        console.error('⚠️ Error loading entries (non-critical):', entriesError);
        // Don't return here, continue with empty entries
      }

      // Create a map of completed habits for today
      const completedToday = new Set(
        (entriesData || []).map(entry => entry.habit_id)
      );

      console.log('✅ Completed today:', Array.from(completedToday));

      // Load stats for each habit and create habit objects
      const habitsWithData = await Promise.all(
        habitsData.map(async (habit) => {
          const { data: stats } = await getHabitStats(habit.id);
          const isCompleted = completedToday.has(habit.id);
          
          return {
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            color: habit.color,
            streak: stats?.currentStreak || 0,
            completed: isCompleted,
            progress: isCompleted ? 100 : 0,
          };
        })
      );

      console.log('✅ Habits with data:', habitsWithData);
      setHabits(habitsWithData);
    } catch (error) {
      console.error('💥 Error loading habits:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load habits: ${errorMessage}`);
      toast.error(`Failed to load habits: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      console.log('🔄 Toggling habit:', id, 'for date:', today);
      
      const { error, action } = await toggleHabitEntry(id, today);
      
      if (error) {
        console.error('❌ Error toggling habit:', error);
        toast.error(`Failed to update habit: ${error.message}`);
        return;
      }

      console.log('✅ Toggle action:', action);

      // Update local state
      setHabits(habits.map(habit => {
        if (habit.id === id) {
          const newCompleted = action === 'created';
          const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
          
          // Check if this creates a milestone
          const milestones = [7, 30, 100];
          if (newCompleted && milestones.includes(newStreak)) {
            // Trigger celebration after a short delay
            setTimeout(() => {
              triggerCelebration(newStreak);
            }, 500);
          }
          
          return { 
            ...habit, 
            completed: newCompleted,
            progress: newCompleted ? 100 : 0,
            streak: newStreak
          };
        }
        return habit;
      }));

      // Show success message
      const habit = habits.find(h => h.id === id);
      if (action === 'created') {
        toast.success(`${habit?.name} marked as complete! 🎉`);
      } else {
        toast.success(`${habit?.name} marked as incomplete`);
      }

      // Reload habits to get accurate streak data
      setTimeout(() => {
        loadHabits();
      }, 1000);
      
    } catch (error) {
      console.error('💥 Error toggling habit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to update habit: ${errorMessage}`);
    }
  };

  const handleAddHabit = () => {
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData: any) => {
    try {
      console.log('🚀 Creating habit with data:', habitData);
      
      const { data, error } = await createHabit({
        name: habitData.name,
        emoji: habitData.emoji,
        reminder_time: habitData.reminderTime,
        reminder_enabled: true,
        active_days: habitData.selectedDays,
        color: '#d4af37', // Default gold color
      });

      if (error) {
        console.error('❌ Error creating habit:', error);
        toast.error(`Failed to create habit: ${error.message}`);
        return;
      }

      console.log('✅ Habit created successfully:', data);
      toast.success('Habit created successfully! 🎉');
      await loadHabits(); // Reload habits
    } catch (error) {
      console.error('💥 Error creating habit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to create habit: ${errorMessage}`);
    }
  };

  const completedCount = habits.filter(h => h.completed).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500 mx-auto" />
            <p className="text-gray-400">Loading your habits...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Today's Habits</h2>
            <p className="text-gray-400">Error loading habits</p>
          </div>
          <Button 
            onClick={loadHabits}
            variant="outline"
            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
          >
            Retry
          </Button>
        </div>

        <Card className="glass border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-300 mb-1">Failed to Load Habits</h3>
                <p className="text-red-400/80 text-sm mb-3">{error}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-red-400/60">Troubleshooting steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-400/60 ml-4">
                    <li>Check your internet connection</li>
                    <li>Refresh the page</li>
                    <li>Sign out and sign back in</li>
                    <li>Check browser console for detailed errors</li>
                  </ul>
                </div>
                <Button 
                  onClick={loadHabits}
                  size="sm"
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state for new users
  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Today's Habits</h2>
            <p className="text-gray-400">No habits yet - let's create your first one!</p>
          </div>
          <Button 
            onClick={handleAddHabit}
            className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
            aria-label="Create your first habit"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Your First Habit
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/20" role="region" aria-labelledby="getting-started-title">
            <CardHeader>
              <CardTitle id="getting-started-title" className="text-gold-500">Get Started with Streaker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4" role="img" aria-label="Target emoji">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to build great habits?</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start your journey by creating your first habit. Whether it's meditation, reading, 
                  exercise, or any other positive routine - we'll help you track and maintain it.
                </p>
                <Button 
                  onClick={handleAddHabit}
                  className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                  aria-label="Create your first habit to start tracking"
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Your First Habit
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak Celebration */}
        <StreakCelebration
          isVisible={showCelebration}
          streakCount={celebrationStreak}
          onClose={hideCelebration}
        />

        {/* Add/Edit Habit Modal */}
        <AddEditHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
          habit={null}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Today's Habits</h2>
          <p className="text-gray-400" aria-live="polite">
            {completedCount} of {habits.length} completed
          </p>
        </div>
        <Button 
          onClick={handleAddHabit}
          className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
          aria-label="Add a new habit"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Today's habits">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            role="listitem"
          >
            <HabitCard habit={habit} onToggle={handleToggleHabit} />
          </motion.div>
        ))}
      </div>

      {/* Streak Celebration */}
      <StreakCelebration
        isVisible={showCelebration}
        streakCount={celebrationStreak}
        onClose={hideCelebration}
      />

      {/* Add/Edit Habit Modal */}
      <AddEditHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        habit={null}
      />
    </div>
  );
}