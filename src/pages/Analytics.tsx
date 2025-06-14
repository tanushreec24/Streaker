import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { HabitCalendarView } from '@/components/calendar/HabitCalendarView';
import { AddEditHabitModal } from '@/components/habits/AddEditHabitModal';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createHabit } from '@/lib/habits';
import { toast } from 'sonner';

type AnalyticsView = 'dashboard' | 'calendar';

export function Analytics() {
  const [currentView, setCurrentView] = useState<AnalyticsView>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateHabit = () => {
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData: any) => {
    try {
      const { data, error } = await createHabit({
        name: habitData.name,
        emoji: habitData.emoji,
        reminder_time: habitData.reminderTime,
        reminder_enabled: true,
        active_days: habitData.selectedDays,
        color: '#d4af37', // Default gold color
      });

      if (error) {
        console.error('Error creating habit:', error);
        toast.error('Failed to create habit');
        return;
      }

      toast.success('Habit created successfully! 🎉');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  const views = [
    { id: 'dashboard' as AnalyticsView, label: 'Dashboard', icon: BarChart3 },
    { id: 'calendar' as AnalyticsView, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="royal-text text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-400">Track your progress and visualize your habit streaks</p>
        </div>
        
        <div className="flex items-center space-x-2 p-1 glass rounded-lg border border-gold-500/20">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <Button
                key={view.id}
                variant={currentView === view.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(view.id)}
                className={cn(
                  "flex items-center space-x-2",
                  currentView === view.id
                    ? "gold-gradient text-royal-900"
                    : "text-gray-400 hover:text-gold-500 hover:bg-gold-500/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{view.label}</span>
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={currentView}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'dashboard' ? (
          <AnalyticsDashboard onCreateHabit={handleCreateHabit} />
        ) : (
          <HabitCalendarView />
        )}
      </motion.div>
      
      <AddEditHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        habit={null}
      />
    </div>
  );
}