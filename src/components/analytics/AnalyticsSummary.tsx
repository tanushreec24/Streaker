import { motion } from 'framer-motion';
import { Flame, Trophy, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsSummaryProps {
  currentStreak: number;
  longestStreak: number;
  weeklyAverage: number;
  totalHabits: number;
}

export function AnalyticsSummary({ 
  currentStreak, 
  longestStreak, 
  weeklyAverage, 
  totalHabits 
}: AnalyticsSummaryProps) {
  const stats = [
    {
      label: 'Current Streak',
      value: currentStreak,
      unit: 'days',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'Keep it going!'
    },
    {
      label: 'Longest Streak',
      value: longestStreak,
      unit: 'days',
      icon: Trophy,
      color: 'text-gold-500',
      bgColor: 'bg-gold-500/10',
      description: 'Personal best'
    },
    {
      label: 'Weekly Average',
      value: weeklyAverage,
      unit: '%',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'This week'
    },
    {
      label: 'Total Habits',
      value: totalHabits,
      unit: 'active',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Being tracked'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 truncate">{stat.label}</p>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    <span className="text-sm text-gray-400">{stat.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}