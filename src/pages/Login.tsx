import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Crown, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sendMagicLink } from '@/lib/auth';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    const { error } = await sendMagicLink(email);
    
    if (error) {
      toast.error(error.message || 'Failed to send magic link');
      console.error('Magic link error:', error);
    } else {
      setEmailSent(true);
      toast.success('Magic link sent! Check your email.');
    }
    
    setLoading(false);
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="glass border-gold-500/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-royal-900" />
              </motion.div>
              <CardTitle className="royal-text text-2xl">Check Your Email</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-4"
              >
                <p className="text-gray-300">
                  We've sent a magic link to:
                </p>
                <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                  <p className="font-medium text-gold-500">{email}</p>
                </div>
                <p className="text-sm text-gray-400">
                  Click the link in your email to sign in to Streaker. 
                  The link will expire in 1 hour.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                >
                  Use Different Email
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-950 via-royal-900 to-royal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left space-y-6"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-3 rounded-xl gold-gradient">
              <Crown className="h-8 w-8 text-royal-900" />
            </div>
            <h1 className="royal-text text-4xl font-bold">Streaker</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Build Royal Habits,<br />
              <span className="royal-text">One Day at a Time</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Track your habits with elegance, visualize your progress, 
              and never break the streak with our premium habit tracker.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 glass rounded-lg border-gold-500/20">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-white">Smart Tracking</div>
            </div>
            <div className="text-center p-4 glass rounded-lg border-gold-500/20">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-white">Rich Analytics</div>
            </div>
            <div className="text-center p-4 glass rounded-lg border-gold-500/20">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-white">Streak Rewards</div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="glass border-gold-500/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="royal-text text-2xl">Welcome to Streaker</CardTitle>
              <p className="text-gray-400">Sign in with your email to get started</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gold-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass border-gold-500/20 focus:border-gold-500/40 text-white placeholder:text-gray-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full gold-gradient text-royal-900 hover:opacity-90 py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-royal-900/30 border-t-royal-900 rounded-full animate-spin" />
                      <span>Sending Magic Link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Send Magic Link</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <p className="text-xs text-gray-500">
                    We'll send you a secure link to sign in without a password.
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className="flex-1 h-px bg-gray-600"></div>
                    <span>Secure & Passwordless</span>
                    <div className="flex-1 h-px bg-gray-600"></div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-400">
              New to Streaker? No worries! Just enter your email and we'll create your account automatically.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}