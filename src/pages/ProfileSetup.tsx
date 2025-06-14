import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, User, Camera, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  '🧠', '📚', '🎨', '🎵', '🏃‍♂️', '🏃‍♀️', '🧘‍♂️', '🧘‍♀️', '💻', '🌱'
];

export function ProfileSetup() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatar_emoji: '👑',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

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
        avatar_url: formData.avatar_emoji, // Store emoji as avatar_url for now
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('Username already taken. Please choose a different one.');
          setCurrentStep(1);
          setErrors({ username: 'Username already taken' });
          return;
        }
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return;
      }

      await refreshProfile();
      toast.success('Profile setup complete! Welcome to Streaker! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting up profile:', error);
      toast.error('Failed to setup profile');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: User,
    },
    {
      title: 'Personalization',
      description: 'Customize your experience',
      icon: Crown,
    },
    {
      title: 'Ready to Go!',
      description: 'Complete your setup',
      icon: Check,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-xl gold-gradient">
              <Crown className="h-8 w-8 text-royal-900" />
            </div>
            <h1 className="royal-text text-3xl font-bold">Welcome to Streaker</h1>
          </div>
          <p className="text-gray-300 text-lg">Let's set up your royal profile</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'gold-gradient text-royal-900' 
                        : isActive 
                        ? 'border-2 border-gold-500 text-gold-500' 
                        : 'border-2 border-gray-600 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className={`font-medium text-sm ${
                        isActive ? 'text-gold-500' : isCompleted ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block flex-1 h-px mx-4 ${
                      isCompleted ? 'bg-gold-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-gold-500/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="royal-text text-xl">
                {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-gray-400">{steps[currentStep - 1].description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-gold-500 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, full_name: e.target.value }));
                        if (errors.full_name) setErrors(prev => ({ ...prev, full_name: '' }));
                      }}
                      className={`glass border-gold-500/20 focus:border-gold-500/40 text-white placeholder:text-gray-500 ${
                        errors.full_name ? 'border-red-500/50' : ''
                      }`}
                    />
                    {errors.full_name && (
                      <p className="text-red-400 text-sm">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gold-500 font-medium">
                      Username *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                      <Input
                        id="username"
                        placeholder="choose_username"
                        value={formData.username}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          setFormData(prev => ({ ...prev, username: value }));
                          if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                        }}
                        className={`pl-8 glass border-gold-500/20 focus:border-gold-500/40 text-white placeholder:text-gray-500 ${
                          errors.username ? 'border-red-500/50' : ''
                        }`}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-400 text-sm">{errors.username}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      This will be your unique identifier. Only letters, numbers, and underscores allowed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gold-500 font-medium">
                      Bio (Optional)
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself and your goals..."
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="glass border-gold-500/20 focus:border-gold-500/40 text-white placeholder:text-gray-500 resize-none"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personalization */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label className="text-gold-500 font-medium">Choose Your Avatar</Label>
                    <div className="flex items-center space-x-4 p-4 glass rounded-lg border border-gold-500/20">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gold-500/20 text-2xl">
                          {formData.avatar_emoji}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">Your Avatar</p>
                        <p className="text-sm text-gray-400">Choose an emoji that represents you</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-10 gap-2">
                      {avatarOptions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatar_emoji: emoji }))}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-110 ${
                            formData.avatar_emoji === emoji
                              ? 'bg-gold-500/20 ring-2 ring-gold-500'
                              : 'hover:bg-gold-500/10'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gold-500 font-medium">
                      Timezone
                    </Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger className="glass border-gold-500/20 focus:border-gold-500/40 text-white">
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent className="glass border-gold-500/20">
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      This helps us send you reminders at the right time.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full gold-gradient flex items-center justify-center text-3xl">
                      {formData.avatar_emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{formData.full_name}</h3>
                      <p className="text-gold-500">@{formData.username}</p>
                      {formData.bio && (
                        <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">{formData.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 glass rounded-lg border border-gold-500/20 space-y-3">
                    <h4 className="font-medium text-white">Profile Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{formData.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Username:</span>
                        <span className="text-white">@{formData.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timezone:</span>
                        <span className="text-white">
                          {timezones.find(tz => tz.value === formData.timezone)?.label || formData.timezone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-blue-300 text-sm text-center">
                      🎉 You're all set! Click "Complete Setup" to start building amazing habits.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gold-500/20">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="gold-gradient text-royal-900 hover:opacity-90"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="gold-gradient text-royal-900 hover:opacity-90"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-royal-900/30 border-t-royal-900 rounded-full animate-spin" />
                        <span>Setting up...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Complete Setup</span>
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@streaker.app" className="text-gold-500 hover:underline">
              support@streaker.app
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}