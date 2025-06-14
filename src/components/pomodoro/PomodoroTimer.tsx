import { motion } from 'framer-motion';

interface PomodoroTimerProps {
  timeLeft: number;
  initialTime: number;
  isRunning: boolean;
  progress: number;
}

export function PomodoroTimer({ timeLeft, initialTime, isRunning, progress }: PomodoroTimerProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={isRunning ? {
          boxShadow: [
            '0 0 20px rgba(212, 175, 55, 0.3)',
            '0 0 40px rgba(212, 175, 55, 0.5)',
            '0 0 20px rgba(212, 175, 55, 0.3)',
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* SVG Timer */}
      <svg
        width="280"
        height="280"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="rgba(55, 65, 81, 0.3)"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="140"
          cy="140"
          r={radius}
          stroke="url(#goldGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#b8941f" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {/* Pulse animation when running */}
          <motion.div
            animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mb-2"
          >
            <motion.div
              animate={isRunning ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-2xl text-royal-900"
            >
              {isRunning ? '⚡' : timeLeft === 0 ? '🎉' : '🎯'}
            </motion.div>
          </motion.div>
          
          <div className="text-sm text-gray-400">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </div>
    </div>
  );
}