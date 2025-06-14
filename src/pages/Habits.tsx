import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddEditHabitModal } from '@/components/habits/AddEditHabitModal';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  reminderTime: string;
  selectedDays: string[];
  streak: number;
  completedToday: boolean;
}

const daysMap = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export function Habits() {
  // Empty habits array for new users
  const [habits, setHabits] = useState<Habit[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddHabit = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = (habitData: any) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prev => prev.map(h => 
        h.id === editingHabit.id 
          ? { ...h, ...habitData }
          : h
      ));
    } else {
      // Add new habit
      const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        streak: 0, // Start with 0 streak
        completedToday: false,
      };
      setHabits(prev => [...prev, newHabit]);
    }
  };

  const handleDeleteHabit = (id: string, habitName: string) => {
    if (window.confirm(`Are you sure you want to delete "${habitName}"? This action cannot be undone.`)) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const filteredHabits = habits.filter(habit =>
    habit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="royal-text text-3xl font-bold">Habits</h1>
          <p className="text-gray-400">Manage and track all your habits</p>
        </div>
        <Button 
          onClick={handleAddHabit}
          className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
          aria-label={habits.length === 0 ? 'Create your first habit' : 'Create a new habit'}
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {habits.length === 0 ? 'Create First Habit' : 'New Habit'}
        </Button>
      </motion.div>

      {habits.length > 0 && (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
            <Input 
              placeholder="Search habits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-gold-500/20 focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
              aria-label="Search through your habits"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
            aria-label="Filter habits"
          >
            <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
            Filter
          </Button>
        </div>
      )}

      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/20" role="region" aria-labelledby="empty-state-title">
            <CardHeader>
              <CardTitle id="empty-state-title" className="text-gold-500">
                {searchQuery ? 'No habits found' : 'No habits yet'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4" role="img" aria-label={searchQuery ? 'Search emoji' : 'Target emoji'}>
                  {searchQuery ? '🔍' : '🎯'}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchQuery 
                    ? `No habits match "${searchQuery}"`
                    : 'Ready to start your habit journey?'
                  }
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Try adjusting your search terms or create a new habit.'
                    : 'Create your first habit and begin building consistent, positive routines that will transform your daily life.'
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={handleAddHabit}
                    className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                    aria-label="Create your first habit to start tracking"
                  >
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Create Your First Habit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Your habits">
          {filteredHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              role="listitem"
            >
              <Card className="glass border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl" role="img" aria-label={`${habit.name} icon`}>
                        {habit.emoji}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{habit.name}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          <span aria-label={`Reminder time: ${habit.reminderTime}`}>
                            {habit.reminderTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditHabit(habit)}
                        className="text-gray-400 hover:text-gold-500 h-8 w-8 p-0 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                        aria-label={`Edit ${habit.name}`}
                      >
                        <Edit className="h-3 w-3" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteHabit(habit.id, habit.name)}
                        className="text-gray-400 hover:text-red-500 h-8 w-8 p-0 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                        aria-label={`Delete ${habit.name}`}
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Streak</span>
                      <Badge variant="secondary" className="bg-gold-500/20 text-gold-500">
                        <span aria-label={`${habit.streak} day streak`}>
                          {habit.streak} days
                        </span>
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        <span>Active days</span>
                      </div>
                      <div className="flex flex-wrap gap-1" role="list" aria-label="Days this habit is active">
                        {habit.selectedDays.map(day => (
                          <Badge
                            key={day}
                            variant="outline"
                            className="text-xs border-gold-500/30 text-gold-500"
                            role="listitem"
                          >
                            {daysMap[day as keyof typeof daysMap]}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gold-500/20">
                      <div className={`text-sm font-medium ${
                        habit.completedToday ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        <span aria-label={habit.completedToday ? 'Completed today' : 'Not completed today'}>
                          {habit.completedToday ? '✅ Completed today' : '⏳ Pending today'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AddEditHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />
    </div>
  );
}