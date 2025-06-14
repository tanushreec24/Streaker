import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Target, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Crown,
  Timer,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'habits', label: 'Habits', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleLogoClick = () => {
    onPageChange('dashboard');
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const userInitials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-gold-500/20">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            aria-label="Go to dashboard"
          >
            <Crown className="h-6 w-6 text-gold-500" />
            <span className="royal-text font-bold text-xl">Streaker</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                    <AvatarFallback className="bg-gold-500/20 text-gold-500 text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-gold-500/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gold-500/20" />
                <DropdownMenuItem 
                  onClick={() => onPageChange('settings')}
                  className="text-gray-300 focus:text-gold-500 focus:bg-gold-500/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-gray-300 focus:text-red-500 focus:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold-500 hover:bg-gold-500/10"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-b border-gold-500/20"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      currentPage === item.id 
                        ? 'gold-gradient text-royal-900' 
                        : 'text-gray-300 hover:text-gold-500 hover:bg-gold-500/10'
                    }`}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass border-r border-gold-500/20 flex-col z-40">
        <div className="p-6 border-b border-gold-500/20">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-full"
            aria-label="Go to dashboard"
          >
            <div className="p-2 rounded-lg gold-gradient">
              <Crown className="h-6 w-6 text-royal-900" />
            </div>
            <div className="text-left">
              <h1 className="royal-text font-bold text-xl">Streaker</h1>
              <p className="text-xs text-gray-400">Track your habits</p>
            </div>
          </button>
        </div>
        
        <div className="flex-1 p-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    currentPage === item.id 
                      ? 'gold-gradient text-royal-900' 
                      : 'text-gray-300 hover:text-gold-500 hover:bg-gold-500/10'
                  }`}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-t border-gold-500/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                  <AvatarFallback className="bg-gold-500/20 text-gold-500 text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {profile?.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass border-gold-500/20" align="end" forceMount>
              <DropdownMenuItem 
                onClick={() => onPageChange('settings')}
                className="text-gray-300 focus:text-gold-500 focus:bg-gold-500/10"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gold-500/20" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-gray-300 focus:text-red-500 focus:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}