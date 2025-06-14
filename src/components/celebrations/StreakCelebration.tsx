import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Trophy, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StreakCelebrationProps {
  isVisible: boolean;
  streakCount: number;
  onClose: () => void;
}

const getMilestoneData = (streak: number) => {
  if (streak >= 100) {
    return {
      title: "Century Streak!",
      message: `You've hit a ${streak}-day streak! Legendary consistency.`,
      emoji: "👑",
      color: "from-purple-500 to-gold-500",
      icon: Crown,
      level: "Legendary"
    };
  } else if (streak >= 30) {
    return {
      title: "Monthly Master!",
      message: `You've hit a ${streak}-day streak! Legendary consistency.`,
      emoji: "🏆",
      color: "from-gold-500 to-yellow-500",
      icon: Trophy,
      level: "Master"
    };
  } else if (streak >= 7) {
    return {
      title: "Week Warrior!",
      message: `You've hit a ${streak}-day streak! Amazing dedication.`,
      emoji: "🔥",
      color: "from-orange-500 to-red-500",
      icon: Flame,
      level: "Warrior"
    };
  }
  
  return {
    title: "Great Start!",
    message: `You've hit a ${streak}-day streak! Keep it up.`,
    emoji: "⭐",
    color: "from-blue-500 to-purple-500",
    icon: Sparkles,
    level: "Starter"
  };
};

export function StreakCelebration({ isVisible, streakCount, onClose }: StreakCelebrationProps) {
  const milestoneData = getMilestoneData(streakCount);
  const Icon = milestoneData.icon;

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    x: Math.random() * window.innerWidth,
    rotation: Math.random() * 360,
    color: ['#d4af37', '#b8941f', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 6)]
  }));

  // Generate sparkles
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    x: Math.random() * 600 - 300,
    y: Math.random() * 600 - 300,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          {/* Confetti Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ 
                  opacity: 0,
                  y: -100,
                  x: particle.x,
                  rotate: 0,
                  scale: 0
                }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: window.innerHeight + 100,
                  rotate: particle.rotation,
                  scale: [0, 1, 1, 0.5]
                }}
                transition={{ 
                  duration: 4,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{ backgroundColor: particle.color }}
              />
            ))}
          </div>

          {/* Sparkles Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                  scale: [0, 1.5, 0], 
                  x: sparkle.x, 
                  y: sparkle.y,
                  rotate: 360 
                }}
                transition={{ 
                  duration: 3, 
                  delay: sparkle.delay,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Sparkles className="h-6 w-6 text-gold-500" />
              </motion.div>
            ))}
          </div>

          {/* Main Celebration Card */}
          <motion.div
            initial={{ scale: 0, rotate: -10, y: 100 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0, rotate: 10, y: -100 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              delay: 0.3 
            }}
            className="relative z-10 max-w-md w-full"
          >
            <Card className="glass border-gold-500/30 shadow-2xl overflow-hidden">
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${milestoneData.color}`} />
              
              <CardContent className="p-8 text-center relative">
                {/* Floating Icons */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    damping: 10, 
                    stiffness: 300,
                    delay: 0.6 
                  }}
                  className="absolute top-4 left-4"
                >
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                    <Icon className="h-4 w-4 text-royal-900" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    damping: 10, 
                    stiffness: 300,
                    delay: 0.8 
                  }}
                  className="absolute top-4 right-4"
                >
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-royal-900" />
                  </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-6"
                >
                  {/* Emoji */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      damping: 8, 
                      stiffness: 300,
                      delay: 1 
                    }}
                    className="text-6xl"
                  >
                    {milestoneData.emoji}
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h2 className="text-2xl font-bold royal-text mb-2">
                      {milestoneData.title}
                    </h2>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${milestoneData.color} text-white`}>
                      {milestoneData.level} Level
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="text-gray-300 text-lg leading-relaxed"
                  >
                    {milestoneData.message} 🎉
                  </motion.p>

                  {/* Streak Display */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                    className="p-4 rounded-lg bg-gold-500/10 border border-gold-500/20"
                  >
                    <div className="text-4xl font-bold text-gold-500 mb-1">
                      {streakCount}
                    </div>
                    <div className="text-sm text-gray-400">
                      Day Streak
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                  >
                    <Button
                      onClick={onClose}
                      className="gold-gradient text-royal-900 hover:opacity-90 w-full py-3 text-lg font-semibold"
                    >
                      Continue Building Habits
                    </Button>
                  </motion.div>

                  {/* Motivational Quote */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="pt-4 border-t border-gold-500/20"
                  >
                    <p className="text-sm text-gray-400 italic">
                      "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- Aristotle</p>
                  </motion.div>
                </motion.div>

                {/* Pulsing Ring Effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-gold-500/30 pointer-events-none"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Auto-close timer indicator */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-gold-500/50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}