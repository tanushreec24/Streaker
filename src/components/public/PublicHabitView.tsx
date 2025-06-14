import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, Crown, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PublicHabitViewProps {
  username: string;
  habitName: string;
}

export function PublicHabitView({ username, habitName }: PublicHabitViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock habit data - in real app this would come from API
  const habitData = {
    id: '1',
    name: 'Morning Meditation',
    emoji: '🧘‍♀️',
    streak: 15,
    longestStreak: 23,
    totalDays: 45,
    completedDays: 38,
    createdAt: '2024-01-01',
    user: {
      username: username,
      displayName: 'John Doe'
    }
  };

  // Mock completion data - in real app this would come from API
  const completedDates = new Set([
    '2024-12-01', '2024-12-02', '2024-12-04', '2024-12-05', '2024-12-06',
    '2024-12-08', '2024-12-09', '2024-12-10', '2024-12-11', '2024-12-12',
    '2024-12-13', '2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18',
    '2024-12-19', '2024-12-20', '2024-12-22', '2024-12-23', '2024-12-24'
  ]);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const formatDateKey = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };
  
  const isCompleted = (day: number) => {
    return completedDates.has(formatDateKey(day));
  };

  const completionRate = Math.round((habitData.completedDays / habitData.totalDays) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800">
      {/* Header */}
      <div className="glass border-b border-gold-500/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-gold-500" />
              <span className="royal-text font-bold text-xl">Streaker</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get Streaker
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Habit Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl mb-4">{habitData.emoji}</div>
            <h1 className="royal-text text-4xl font-bold">{habitData.name}</h1>
            <p className="text-gray-400 text-lg">
              by <span className="text-gold-500 font-medium">@{habitData.user.username}</span>
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="glass border-gold-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gold-500 mb-1">{habitData.streak}</div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </CardContent>
            </Card>

            <Card className="glass border-gold-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gold-500 mb-1">{habitData.longestStreak}</div>
                <div className="text-sm text-gray-400">Longest Streak</div>
              </CardContent>
            </Card>

            <Card className="glass border-gold-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gold-500 mb-1">{habitData.completedDays}</div>
                <div className="text-sm text-gray-400">Total Completed</div>
              </CardContent>
            </Card>

            <Card className="glass border-gold-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gold-500 mb-1">{completionRate}%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-gold-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gold-500 text-xl">
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-gold-500/20 text-gold-500">
                    Progress Calendar
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.01 }}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center relative rounded-lg transition-all duration-200",
                        isToday(day || 0) ? "ring-1 ring-gold-500/50" : ""
                      )}
                    >
                      {day && (
                        <>
                          {/* Date number */}
                          <span className={cn(
                            "text-sm font-medium mb-1",
                            isToday(day) ? "text-gold-500" : "text-gray-300"
                          )}>
                            {day}
                          </span>
                          
                          {/* Completion dot */}
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full border transition-all duration-200",
                              isCompleted(day) 
                                ? "bg-gold-500 border-gold-500 shadow-sm" 
                                : "border-gray-500 bg-transparent"
                            )}
                          />
                          
                          {/* Today indicator */}
                          {isToday(day) && (
                            <motion.div
                              className="absolute inset-0 rounded-lg border border-gold-500/30 pointer-events-none"
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gold-500/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gold-500" />
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full border border-gray-500" />
                    <span className="text-sm text-gray-400">Not completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full border border-gold-500" />
                    <span className="text-sm text-gray-400">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass border-gold-500/20 bg-gradient-to-r from-gold-500/5 to-royal-800/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  🎯 Building Consistency, One Day at a Time
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  {habitData.user.displayName} is building the habit of {habitData.name.toLowerCase()} 
                  and has maintained a {habitData.streak}-day streak! Join them on their journey 
                  to better habits and consistent growth.
                </p>
                <Button className="gold-gradient text-royal-900 hover:opacity-90">
                  <Crown className="h-4 w-4 mr-2" />
                  Start Your Own Habit Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold-500/20 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="h-5 w-5 text-gold-500" />
              <span className="royal-text font-bold text-lg">Made with Streaker</span>
            </div>
            <p className="text-gray-400 text-sm">
              Track your habits, build streaks, and achieve your goals with the royal habit tracker.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Button variant="ghost" size="sm" className="text-gold-500 hover:bg-gold-500/10">
                Get Started Free
              </Button>
              <span className="text-gray-600">•</span>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gold-500">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}