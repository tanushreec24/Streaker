import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CalendarProps {
  selectedHabitId?: string;
  completedDates?: Set<string>;
  onDateToggle?: (date: string) => void;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function Calendar({ 
  selectedHabitId, 
  completedDates = new Set(), 
  onDateToggle,
  currentDate: propCurrentDate,
  onDateChange
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(propCurrentDate || new Date());
  
  // Sync with prop changes
  useEffect(() => {
    if (propCurrentDate) {
      setCurrentDate(propCurrentDate);
    }
  }, [propCurrentDate]);

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
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };
  
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
  
  const isFutureDate = (day: number) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    return dayDate > today;
  };
  
  const handleDateClick = (day: number) => {
    if (!selectedHabitId) return;
    if (onDateToggle) {
      onDateToggle(formatDateKey(day));
    }
  };

  return (
    <Card className="glass border-gold-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gold-500 text-lg">
            {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="text-gold-500 hover:bg-gold-500/10 h-8 w-8 p-0"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="text-gold-500 hover:bg-gold-500/10 h-8 w-8 p-0"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={cn(
                "aspect-square flex flex-col items-center justify-center relative rounded-lg transition-all duration-200",
                day && selectedHabitId && !isFutureDate(day) ? "hover:bg-gold-500/10 cursor-pointer" : "",
                day && !selectedHabitId ? "cursor-not-allowed opacity-50" : "",
                day && isFutureDate(day) ? "opacity-40 cursor-not-allowed" : "",
                isToday(day || 0) ? "ring-1 ring-gold-500/50" : ""
              )}
              onClick={() => day && !isFutureDate(day) && handleDateClick(day)}
            >
              {day && (
                <>
                  {/* Date number */}
                  <span className={cn(
                    "text-sm font-medium mb-1",
                    isToday(day) ? "text-gold-500" : "text-gray-300",
                    isFutureDate(day) ? "text-gray-500" : ""
                  )}>
                    {day}
                  </span>
                  
                  {/* Completion dot */}
                  <motion.div
                    className={cn(
                      "w-2 h-2 rounded-full border transition-all duration-200",
                      isCompleted(day) 
                        ? "bg-gold-500 border-gold-500 shadow-sm" 
                        : selectedHabitId && !isFutureDate(day)
                        ? "border-gray-500 bg-transparent hover:border-gold-500/50"
                        : "border-gray-600 bg-transparent"
                    )}
                    whileHover={selectedHabitId && !isFutureDate(day) ? { scale: 1.2 } : {}}
                    whileTap={selectedHabitId && !isFutureDate(day) ? { scale: 0.9 } : {}}
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
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gold-500/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full border border-gray-500" />
            <span className="text-xs text-gray-400">Not completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full border border-gold-500" />
            <span className="text-xs text-gray-400">Today</span>
          </div>
        </div>
        
        {/* Instructions */}
        {selectedHabitId ? (
          <div className="text-center mt-3 text-xs text-gray-500">
            Click on any day to toggle completion for this habit
          </div>
        ) : (
          <div className="text-center mt-3 text-xs text-gray-500">
            Select a habit above to start tracking
          </div>
        )}
      </CardContent>
    </Card>
  );
}