import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Loader2, Mail, Clock, Calendar, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/auth';
import { toast } from 'sonner';

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  { value: 'UTC', label: 'UTC' },
];

const avatarOptions = [
  '👑', '🎯', '🏆', '⭐', '🔥', '💎', '🚀', '⚡', '🌟', '💪',
  '🧠', '📚', '🎨', '🎵', '🏃‍♂️', '🏃‍♀️', '🧘‍♂️', '🧘‍♀️', '💻', '🌱',
  '🎪', '🎭', '🎨', '🎬', '🎮', '🎲', '🎸', '🎺', '🎻', '🥁',
  '🌈', '🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌳', '🌲'
];

export function ProfileSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    timezone: 'UTC',
    avatar_url: '👑',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        timezone: profile.timezone || 'UTC',
        avatar_url: profile.avatar_url || '👑',
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!user) {
        toast.error('User not found');
        return;
      }

      const { error } = await updateProfile(user.id, {
        full_name: formData.full_name,
        username: formData.username.toLowerCase(),
        timezone: formData.timezone,
        avatar_url: formData.avatar_url,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('Username already taken. Please choose a different one.');
          setErrors({ username: 'Username already taken' });
          return;
        }
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return;
      }

      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        timezone: profile.timezone || 'UTC',
        avatar_url: profile.avatar_url || '👑',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: formData.timezone,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="royal-text text-3xl font-bold mb-2">Profile & Account</h1>
            <p className="text-gray-400">Manage your personal information and account settings</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-gold-500 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gold-500/20 text-3xl">
                    {formData.avatar_url}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                      <Camera className="h-4 w-4 text-royal-900" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gold-500 font-medium text-sm">Choose Avatar</Label>
                      <div className="grid grid-cols-10 gap-2 mt-2">
                        {avatarOptions.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatar_url: emoji }))}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-110 ${
                              formData.avatar_url === emoji
                                ? 'bg-gold-500/20 ring-2 ring-gold-500'
                                : 'hover:bg-gold-500/10'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-white">{profile.full_name}</h3>
                    <p className="text-gold-500">@{profile.username}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(profile.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gold-500 font-medium">
                  Full Name *
                </Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, full_name: e.target.value }));
                      if (errors.full_name) setErrors(prev => ({ ...prev, full_name: '' }));
                    }}
                    className={`glass border-gold-500/20 focus:border-gold-500/40 text-white ${
                      errors.full_name ? 'border-red-500/50' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-3 glass rounded-lg border border-gold-500/20">
                    <span className="text-white">{profile.full_name}</span>
                  </div>
                )}
                {errors.full_name && (
                  <p className="text-red-400 text-sm">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gold-500 font-medium">
                  Username *
                </Label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        setFormData(prev => ({ ...prev, username: value }));
                        if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                      }}
                      className={`pl-8 glass border-gold-500/20 focus:border-gold-500/40 text-white ${
                        errors.username ? 'border-red-500/50' : ''
                      }`}
                      placeholder="username"
                    />
                  </div>
                ) : (
                  <div className="p-3 glass rounded-lg border border-gold-500/20">
                    <span className="text-white">@{profile.username}</span>
                  </div>
                )}
                {errors.username && (
                  <p className="text-red-400 text-sm">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gold-500 font-medium">
                  Email Address
                </Label>
                <div className="p-3 glass rounded-lg border border-gold-500/20 opacity-60">
                  <span className="text-white">{profile.email}</span>
                  <Badge variant="secondary" className="ml-2 bg-gray-500/20 text-gray-400 text-xs">
                    Cannot be changed
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-gold-500 font-medium">
                  Timezone
                </Label>
                {isEditing ? (
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="glass border-gold-500/20 focus:border-gold-500/40 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-gold-500/20">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 glass rounded-lg border border-gold-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-white">
                        {timezones.find(tz => tz.value === profile.timezone)?.label || profile.timezone}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{getCurrentTime()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 pt-4 border-t border-gold-500/20"
              >
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="gold-gradient text-royal-900 hover:opacity-90 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-gold-500">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-400">Account Created</Label>
                  <p className="text-white">{formatDate(profile.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Last Updated</Label>
                  <p className="text-white">{formatDate(profile.updated_at)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-400">Account ID</Label>
                  <p className="text-white font-mono text-sm">{profile.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Current Time</Label>
                  <p className="text-white">{getCurrentTime()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-500">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="font-medium text-blue-300 mb-2">🔒 Your Data is Secure</h4>
                <p className="text-blue-400/80 text-sm">
                  Your personal information is encrypted and stored securely. We never share your data 
                  with third parties without your explicit consent.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 glass rounded-lg border border-gold-500/20">
                  <h5 className="font-medium text-white text-sm mb-1">Email Verification</h5>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-400 text-sm">Verified</span>
                  </div>
                </div>
                
                <div className="p-3 glass rounded-lg border border-gold-500/20">
                  <h5 className="font-medium text-white text-sm mb-1">Two-Factor Auth</h5>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span className="text-gray-400 text-sm">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}