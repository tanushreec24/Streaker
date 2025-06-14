import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AnalyticsSummary } from './AnalyticsSummary';
import { CompletionChart } from './CompletionChart';
import { CompletionDonut } from './CompletionDonut';

// Generate empty data for new users
const generateEmptyData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      completed: 0,
      total: 0,
      percentage: 0,
    });
  }
  
  return data;
};

interface AnalyticsDashboardProps {
  onCreateHabit?: () => void;
}

export function AnalyticsDashboard({ onCreateHabit }: AnalyticsDashboardProps) {
  const chartData = generateEmptyData();
  
  // All analytics start at zero for new users
  const totalCompletedDays = 0;
  const currentStreak = 0;
  const longestStreak = 0;
  const weeklyAverage = 0;
  const totalHabits = 0;

  const handleCreateHabit = () => {
    if (onCreateHabit) {
      onCreateHabit();
    }
  };

  // Show empty state for new users
  if (totalHabits === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="royal-text text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your progress and celebrate your achievements</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/20" role="region" aria-labelledby="no-data-title">
            <CardHeader>
              <CardTitle id="no-data-title" className="text-gold-500">No Data to Display Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4" role="img" aria-label="Chart emoji">📈</div>
                <h3 className="text-xl font-semibold text-white mb-2">Your analytics will appear here</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Once you create habits and start tracking them, you'll see detailed analytics including 
                  streaks, completion rates, and beautiful charts showing your progress over time.
                </p>
                <Button 
                  onClick={handleCreateHabit}
                  className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                  aria-label="Create your first habit to start seeing analytics"
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="royal-text text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Track your progress and celebrate your achievements</p>
      </motion.div>

      <AnalyticsSummary
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        weeklyAverage={weeklyAverage}
        totalHabits={totalHabits}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompletionChart data={chartData} />
        </div>
        <div>
          <CompletionDonut 
            completedDays={totalCompletedDays} 
            totalDays={30} 
          />
        </div>
      </div>
    </div>
  );
}