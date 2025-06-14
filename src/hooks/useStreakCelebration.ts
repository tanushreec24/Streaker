import { useState, useEffect } from 'react';

interface UseStreakCelebrationProps {
  currentStreak: number;
  onMilestone?: (streak: number) => void;
}

export function useStreakCelebration({ currentStreak, onMilestone }: UseStreakCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const [lastCelebratedStreak, setLastCelebratedStreak] = useState(0);

  // Define milestone thresholds
  const milestones = [7, 30, 100, 365, 500, 1000];

  useEffect(() => {
    // Check if current streak hits a milestone
    const hitMilestone = milestones.find(milestone => 
      currentStreak >= milestone && lastCelebratedStreak < milestone
    );

    if (hitMilestone && currentStreak > 0) {
      setCelebrationStreak(currentStreak);
      setShowCelebration(true);
      setLastCelebratedStreak(currentStreak);
      
      // Call optional callback
      if (onMilestone) {
        onMilestone(currentStreak);
      }

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStreak, lastCelebratedStreak, onMilestone]);

  const triggerCelebration = (streak: number) => {
    setCelebrationStreak(streak);
    setShowCelebration(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const hideCelebration = () => {
    setShowCelebration(false);
  };

  return {
    showCelebration,
    celebrationStreak,
    triggerCelebration,
    hideCelebration
  };
}