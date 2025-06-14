import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
}

interface CelebrationAnimationProps {
  onLogSession: () => void;
  selectedHabit?: Habit;
  sessionDuration: number;
}

export function CelebrationAnimation({ 
  onLogSession, 
  selectedHabit, 
  sessionDuration 
}: CelebrationAnimationProps) {
  // Sparkle positions for animation
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    x: Math.random() * 400 - 200,
    y: Math.random() * 400 - 200,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      {/* Sparkles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              x: 0, 
              y: 0,
              rotate: 0 
            }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0], 
              x: sparkle.x, 
              y: sparkle.y,
              rotate: 360 
            }}
            transition={{ 
              duration: 2, 
              delay: sparkle.delay,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute top-1/2 left-1/2"
          >
            <Sparkles className="h-6 w-6 text-gold-500" />
          </motion.div>
        ))}
      </div>

      {/* Celebration Card */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 300,
          delay: 0.2 
        }}
        className="relative z-10"
      >
        <Card className="glass border-gold-500/30 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                damping: 10, 
                stiffness: 300,
                delay: 0.5 
              }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full gold-gradient flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-royal-900" />
              </div>
            </motion.div>

            {/* Celebration Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold royal-text">
                🎉 Focus Session Complete!
              </h2>
              
              <p className="text-gray-300">
                Great job! You stayed focused for <span className="font-bold text-gold-500">{sessionDuration} minutes</span>
              </p>

              {selectedHabit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="p-4 rounded-lg bg-gold-500/10 border border-gold-500/20"
                >
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="text-3xl">{selectedHabit.emoji}</div>
                    <div>
                      <div className="font-semibold text-white">{selectedHabit.name}</div>
                      <div className="text-sm text-gray-400">Ready to log this session?</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col space-y-3 mt-6"
            >
              {selectedHabit ? (
                <Button
                  onClick={onLogSession}
                  className="gold-gradient text-royal-900 hover:opacity-90 w-full py-3"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Log as {selectedHabit.name} Progress
                </Button>
              ) : (
                <div className="text-sm text-gray-400 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  💡 Link this session to a habit to track your progress!
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10 w-full"
              >
                Start Another Session
              </Button>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-6 pt-4 border-t border-gold-500/20"
            >
              <p className="text-sm text-gray-400 italic">
                "Success is the sum of small efforts repeated day in and day out."
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              y: -100,
              x: Math.random() * window.innerWidth,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: window.innerHeight + 100,
              rotate: Math.random() * 720
            }}
            transition={{ 
              duration: 3,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: ['#d4af37', '#b8941f', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}