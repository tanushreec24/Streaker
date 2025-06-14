import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { CelebrationAnimation } from '@/components/pomodoro/CelebrationAnimation';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
}

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock habits data - in real app this would come from state/database
  const habits: Habit[] = [
    { id: '1', name: 'Deep Work', emoji: '💻', streak: 5 },
    { id: '2', name: 'Study Session', emoji: '📚', streak: 3 },
    { id: '3', name: 'Creative Writing', emoji: '✍️', streak: 7 },
    { id: '4', name: 'Learning New Skill', emoji: '🎯', streak: 2 },
  ];

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  // Timer presets
  const timerPresets = [
    { label: '15 minutes', value: 15 * 60 },
    { label: '25 minutes (Pomodoro)', value: 25 * 60 },
    { label: '30 minutes', value: 30 * 60 },
    { label: '45 minutes', value: 45 * 60 },
    { label: '60 minutes', value: 60 * 60 },
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setShowCelebration(true);
    setCompletedSessions(prev => prev + 1);
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handlePresetChange = (value: string) => {
    const newTime = parseInt(value);
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsRunning(false);
  };

  const handleLogSession = () => {
    if (selectedHabit) {
      // In a real app, this would update the habit completion
      console.log(`Logged session for habit: ${selectedHabit.name}`);
      setShowCelebration(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg gold-gradient">
            <Target className="h-5 w-5 text-royal-900" />
          </div>
          <h1 className="royal-text text-3xl font-bold">Pomodoro Focus Mode</h1>
        </div>
        <p className="text-gray-400">Stay focused and productive with timed work sessions</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="glass border-gold-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">{completedSessions}</div>
            <div className="text-sm text-gray-400">Sessions Today</div>
          </CardContent>
        </Card>
        <Card className="glass border-gold-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">{Math.floor(initialTime / 60)}</div>
            <div className="text-sm text-gray-400">Minutes Set</div>
          </CardContent>
        </Card>
        <Card className="glass border-gold-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">{isRunning ? '🔥' : '⏸️'}</div>
            <div className="text-sm text-gray-400">{isRunning ? 'Active' : 'Paused'}</div>
          </CardContent>
        </Card>
        <Card className="glass border-gold-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">{selectedHabit ? selectedHabit.emoji : '🎯'}</div>
            <div className="text-sm text-gray-400">Current Focus</div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-gold-500/20">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-8">
                  {/* Circular Timer */}
                  <PomodoroTimer
                    timeLeft={timeLeft}
                    initialTime={initialTime}
                    isRunning={isRunning}
                    progress={progress}
                  />

                  {/* Time Display */}
                  <div className="text-center">
                    <div className="text-6xl font-bold royal-text mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-gray-400">
                      {isRunning ? 'Focus time remaining' : timeLeft === 0 ? 'Session complete!' : 'Ready to start'}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center space-x-4">
                    {!isRunning ? (
                      <Button
                        onClick={handleStart}
                        disabled={timeLeft === 0}
                        className="gold-gradient text-royal-900 hover:opacity-90 px-8 py-3 text-lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Focus
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePause}
                        variant="outline"
                        className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 px-8 py-3 text-lg"
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10 px-6 py-3"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timer Presets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-gold-500 text-lg">Timer Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {timerPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={initialTime === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePresetChange(preset.value.toString())}
                      disabled={isRunning}
                      className={
                        initialTime === preset.value
                          ? "gold-gradient text-royal-900"
                          : "border-gold-500/30 text-gray-300 hover:bg-gold-500/10"
                      }
                    >
                      {preset.label.split(' ')[0]}m
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Habit Selection */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-gold-500 text-lg">Link to Habit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
                  <SelectTrigger className="glass border-gold-500/20 focus:border-gold-500/40">
                    <SelectValue placeholder="Choose a habit to track" />
                  </SelectTrigger>
                  <SelectContent className="glass border-gold-500/20">
                    {habits.map((habit) => (
                      <SelectItem key={habit.id} value={habit.id}>
                        <div className="flex items-center space-x-2">
                          <span>{habit.emoji}</span>
                          <span>{habit.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedHabit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{selectedHabit.emoji}</div>
                      <div>
                        <div className="font-medium text-white">{selectedHabit.name}</div>
                        <div className="text-sm text-gray-400">
                          {selectedHabit.streak} day streak
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-xs text-gray-500 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  💡 Linking a session to a habit will count towards your daily progress when completed.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Session History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-gold-500 text-lg">Today's Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {completedSessions === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">⏰</div>
                    <p className="text-gray-400 text-sm">No sessions completed yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Array.from({ length: completedSessions }, (_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-white">Session {i + 1}</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                          {Math.floor(initialTime / 60)}m
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationAnimation
            onLogSession={handleLogSession}
            selectedHabit={selectedHabit}
            sessionDuration={Math.floor(initialTime / 60)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}