import { motion } from 'framer-motion';
import { Calendar, Flame, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardHeader() {
  const stats = [
    { label: 'Current Streak', value: '0', icon: Flame, color: 'text-orange-500' },
    { label: 'Total Habits', value: '0', icon: Award, color: 'text-gold-500' },
    { label: 'This Week', value: '0%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Days Active', value: '0', icon: Calendar, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="royal-text text-4xl font-bold"
        >
          Welcome to Streaker
        </motion.h1>
        <p className="text-gray-400">Start building consistent habits, one day at a time</p>
      </div>

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
              <Card className="glass border-gold-500/20 hover:border-gold-500/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gold-500">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}