import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface CompletionChartProps {
  data: Array<{
    date: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

export function CompletionChart({ data }: CompletionChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass border border-gold-500/30 p-3 rounded-lg shadow-lg">
          <p className="text-gold-500 font-medium">{label}</p>
          <p className="text-white">
            Completed: <span className="font-bold">{data.completed}/{data.total}</span>
          </p>
          <p className="text-gray-300">
            Rate: <span className="font-bold">{data.percentage}%</span>
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
      transition={{ delay: 0.4 }}
    >
      <Card className="glass border-gold-500/20">
        <CardHeader>
          <CardTitle className="text-gold-500 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Daily Completion Rate (Last 30 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#d4af37"
                  strokeWidth={3}
                  dot={{ fill: '#d4af37', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#d4af37', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}