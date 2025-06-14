import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    streak: number;
    completed: boolean;
    progress: number;
    icon: string;
    color: string;
  };
  onToggle: (id: string) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle(habit.id);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`glass border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 ${
          habit.completed ? 'streak-glow' : ''
        }`}
        role="article"
        aria-labelledby={`habit-${habit.id}-name`}
        aria-describedby={`habit-${habit.id}-progress`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: habit.color + '20', color: habit.color }}
                role="img"
                aria-label={`${habit.name} icon`}
              >
                {habit.icon}
              </div>
              <div>
                <h3 id={`habit-${habit.id}-name`} className="font-semibold text-white">{habit.name}</h3>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Flame className="h-3 w-3 text-orange-500" aria-hidden="true" />
                  <span aria-label={`${habit.streak} day streak`}>{habit.streak} day streak</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
              aria-label={`More options for ${habit.name}`}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Today's Progress</span>
              <span className="text-sm font-medium text-gold-500" aria-label={`${habit.progress} percent complete`}>
                {habit.progress}%
              </span>
            </div>
            <Progress 
              value={habit.progress} 
              className="h-2" 
              aria-label={`Progress: ${habit.progress}% complete`}
            />
            
            <Button
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              variant={habit.completed ? "default" : "outline"}
              className={`w-full focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900 ${
                habit.completed 
                  ? 'gold-gradient text-royal-900 hover:opacity-90' 
                  : 'border-gold-500/30 text-gold-500 hover:bg-gold-500/10'
              }`}
              disabled={isAnimating}
              aria-pressed={habit.completed}
              aria-describedby={`habit-${habit.id}-progress`}
              aria-label={habit.completed ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
            >
              <motion.div
                className="flex items-center space-x-2"
                animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                {habit.completed ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{habit.completed ? 'Completed' : 'Mark Complete'}</span>
              </motion.div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}