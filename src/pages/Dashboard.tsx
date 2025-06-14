import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TodayHabits } from '@/components/dashboard/TodayHabits';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <TodayHabits />
    </div>
  );
}