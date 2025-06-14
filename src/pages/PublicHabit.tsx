import { useParams } from 'react-router-dom';
import { PublicHabitView } from '@/components/public/PublicHabitView';

export function PublicHabit() {
  const { username, habitName } = useParams<{ username: string; habitName: string }>();

  if (!username || !habitName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Habit Not Found</h1>
          <p className="text-gray-400">The habit you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return <PublicHabitView username={username} habitName={habitName} />;
}