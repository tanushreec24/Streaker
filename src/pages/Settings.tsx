import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, User, Palette, LogOut, Settings as SettingsIcon, TestTube } from 'lucide-react';
import { ReminderSettings } from '@/components/settings/ReminderSettings';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AddEditHabitModal } from '@/components/habits/AddEditHabitModal';
import { triggerHabitReminders } from '@/lib/reminders';
import { createHabit } from '@/lib/habits';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type SettingsView = 'main' | 'reminders' | 'profile' | 'appearance';

export function Settings() {
  const { signOut } = useAuth();
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testingReminders, setTestingReminders] = useState(false);

  const handleCreateHabit = () => {
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData: any) => {
    try {
      const { data, error } = await createHabit({
        name: habitData.name,
        emoji: habitData.emoji,
        reminder_time: habitData.reminderTime,
        reminder_enabled: true,
        active_days: habitData.selectedDays,
        color: '#d4af37', // Default gold color
      });

      if (error) {
        console.error('Error creating habit:', error);
        toast.error('Failed to create habit');
        return;
      }

      toast.success('Habit created successfully! 🎉');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  const handleTestReminders = async () => {
    setTestingReminders(true);
    try {
      const result = await triggerHabitReminders();
      
      if (result.success) {
        toast.success('Test reminder sent! Check your email. 📧');
      } else {
        toast.error('Failed to send test reminder: ' + result.error);
      }
    } catch (error) {
      console.error('Error testing reminders:', error);
      toast.error('Failed to test reminders');
    } finally {
      setTestingReminders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const settingsOptions = [
    { 
      id: 'profile' as SettingsView,
      icon: User, 
      label: 'Profile & Account', 
      description: 'Manage your personal information, avatar, and account settings' 
    },
    { 
      id: 'reminders' as SettingsView,
      icon: Bell, 
      label: 'Reminders & Notifications', 
      description: 'Configure when you want to be reminded about your habits' 
    },
    { 
      id: 'appearance' as SettingsView,
      icon: Palette, 
      label: 'Appearance', 
      description: 'Customize your app theme and display options' 
    },
  ];

  if (currentView === 'reminders') {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => setCurrentView('main')}
            className="text-gold-500 hover:bg-gold-500/10 mb-4 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
            aria-label="Go back to main settings"
          >
            ← Back to Settings
          </Button>
        </motion.div>
        <ReminderSettings onCreateHabit={handleCreateHabit} />
        
        <AddEditHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
          habit={null}
        />
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => setCurrentView('main')}
            className="text-gold-500 hover:bg-gold-500/10 mb-4 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
            aria-label="Go back to main settings"
          >
            ← Back to Settings
          </Button>
        </motion.div>
        <ProfileSettings />
      </div>
    );
  }

  if (currentView === 'appearance') {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => setCurrentView('main')}
            className="text-gold-500 hover:bg-gold-500/10 mb-4 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
            aria-label="Go back to main settings"
          >
            ← Back to Settings
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="royal-text text-3xl font-bold mb-2">Appearance</h1>
          <p className="text-gray-400">Customize your app theme and display options</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-gold-500">Theme Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Theme customization options will be available in a future update. 
                  Stay tuned for dark/light mode toggles and custom color schemes!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg gold-gradient">
            <SettingsIcon className="h-5 w-5 text-royal-900" aria-hidden="true" />
          </div>
          <h1 className="royal-text text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-gray-400">Customize your Streaker experience</p>
      </motion.div>

      <div className="space-y-4" role="list" aria-label="Settings options">
        {settingsOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              role="listitem"
            >
              <Card className="glass border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <button
                    onClick={() => setCurrentView(option.id)}
                    className="w-full text-left focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900 rounded-lg"
                    aria-describedby={`${option.id}-description`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg gold-gradient group-hover:scale-105 transition-transform">
                          <Icon className="h-5 w-5 text-royal-900" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-gold-500 transition-colors">
                            {option.label}
                          </h3>
                          <p id={`${option.id}-description`} className="text-sm text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <span 
                        className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        aria-hidden="true"
                      >
                        Configure →
                      </span>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Developer Tools */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass border-blue-500/20" role="region" aria-labelledby="dev-tools">
          <CardHeader>
            <CardTitle id="dev-tools" className="text-blue-500 flex items-center space-x-2">
              <TestTube className="h-5 w-5" aria-hidden="true" />
              <span>Developer Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Test the reminder system and other features during development.
              </p>
              <Button 
                onClick={handleTestReminders}
                disabled={testingReminders}
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                aria-label="Send a test reminder email"
              >
                {testingReminders ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mr-2" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" aria-hidden="true" />
                    Test Reminder Email
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass border-red-500/20" role="region" aria-labelledby="account-actions">
          <CardHeader>
            <CardTitle id="account-actions" className="text-red-500 flex items-center space-x-2">
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span>Account Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Need to take a break? You can sign out of your account here.
              </p>
              <Button 
                onClick={handleSignOut}
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                aria-label="Sign out of your account"
              >
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}