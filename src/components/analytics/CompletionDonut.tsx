import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface CompletionDonutProps {
  completedDays: number;
  totalDays: number;
}

export function CompletionDonut({ completedDays, totalDays }: CompletionDonutProps) {
  const missedDays = totalDays - completedDays;
  const completionRate = Math.round((completedDays / totalDays) * 100);

  const data = [
    { name: 'Completed', value: completedDays, color: '#d4af37' },
    { name: 'Missed', value: missedDays, color: '#374151' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass border border-gold-500/30 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gold-500">
            {data.value} days ({Math.round((data.value / totalDays) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-gold-500 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Completion Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-500">{completionRate}%</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gold-500"></div>
              <span className="text-sm text-gray-300">Completed ({completedDays})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <span className="text-sm text-gray-300">Missed ({missedDays})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}