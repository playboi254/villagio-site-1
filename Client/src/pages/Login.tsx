import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import villagioLogo from '@/assets/villagio-logo.png';
import heroImage from '@/assets/hero-slide1.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      navigate('/');
    } catch {
      toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(152, 45%, 14%)' }}>
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl"
          style={{ 
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Left Side - Image */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <img 
              src={heroImage} 
              alt="Fresh produce" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <img src={villagioLogo} alt="Villagio" className="h-14 mb-4 brightness-0 invert" />
              <p className="text-white/90 text-lg">
                Fresh organic produce delivered to your doorstep. Healthy living made simple.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="max-w-sm mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
              <p className="text-center text-white/60 mb-8">Sign in to continue to Villagio</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-white/80 text-sm mb-2 block">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:bg-white/15 focus:border-white/30"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-white/80 text-sm mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:bg-white/15 focus:border-white/30"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-white/30 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <span className="text-sm text-white/70">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-secondary hover:text-secondary-light transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-secondary hover:bg-secondary-light text-secondary-foreground rounded-xl font-semibold text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-white/50" style={{ backgroundColor: 'hsl(152, 45%, 14%)' }}>or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl font-medium"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
              </form>

              <p className="text-center mt-8 text-white/60">
                Don't have an account?{' '}
                <Link to="/register" className="text-secondary hover:text-secondary-light font-medium transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-secondary mb-3">About Villagio</h4>
              <p className="text-white/60 text-xs leading-relaxed">
                Your trusted partner for fresh, organic produce. Quality and freshness guaranteed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary mb-3">Quick Links</h4>
              <ul className="space-y-1.5">
                <li><Link to="/" className="text-white/60 hover:text-orange transition-colors text-xs">Home</Link></li>
                <li><Link to="/products" className="text-white/60 hover:text-orange transition-colors text-xs">Shop</Link></li>
                <li><Link to="/about" className="text-white/60 hover:text-orange transition-colors text-xs">About</Link></li>
                <li><Link to="/contact" className="text-white/60 hover:text-orange transition-colors text-xs">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary mb-3">Support</h4>
              <ul className="space-y-1.5">
                <li><Link to="/help" className="text-white/60 hover:text-orange transition-colors text-xs">Help Center</Link></li>
                <li><Link to="/privacy" className="text-white/60 hover:text-orange transition-colors text-xs">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-white/60 hover:text-orange transition-colors text-xs">Terms of Service</Link></li>
                <li><Link to="/shipping" className="text-white/60 hover:text-orange transition-colors text-xs">Shipping Info</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary mb-3">Get in Touch</h4>
              <ul className="space-y-1.5 text-white/60 text-xs">
                <li>info@villagiofresh.co.ke</li>
                <li>+254 115 566 775</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-4 text-center">
            <p className="text-white/40 text-xs">
              © {currentYear} Villagio. All rights reserved. Made with love for fresh food lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
