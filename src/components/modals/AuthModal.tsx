import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authService, isSupabaseConfigured } from '../../services/supabaseClient';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    setActiveTab
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const isSignUp = authModalMode === 'signup';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up with Supabase
        await authService.signUp(email, password, fullName);
        setSuccessMessage('Account created successfully! Welcome to LinguTrack AI.');
        setTimeout(() => {
          handleClose();
          setActiveTab('record-upload');
        }, 1200);
      } else {
        // Sign In with Supabase
        await authService.signInWithPassword(email, password);
        setSuccessMessage('Successfully signed in! Loading your workspace...');
        setTimeout(() => {
          handleClose();
          setActiveTab('record-upload');
        }, 800);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Format friendly error messages
      const msg = err?.message || 'Authentication failed. Please try again.';
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      } else if (msg.includes('User already registered')) {
        setErrorMessage('An account with this email already exists. Please sign in.');
      } else if (msg.includes('rate limit')) {
        setErrorMessage('Too many attempts. Please wait a moment and try again.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setErrorMessage(err?.message || 'Failed to initiate Google sign in.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md bg-card-theme/95 border border-theme shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Decorative Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-theme-muted hover:text-theme-primary hover:bg-card-subtle-theme border border-transparent hover:border-theme transition-all z-10"
          aria-label="Close authentication modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Brand */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <BrandLogo size="md" />
            </div>
            <h2 className="text-xl font-bold text-theme-primary tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-theme-muted">
              {isSignUp 
                ? 'Join 10,000+ teams transcribing in 50+ languages'
                : 'Sign in to access your multilingual meeting archive'}
            </p>
          </div>

          {/* Toggle Switch Tabs */}
          <div className="flex p-1 rounded-xl bg-card-subtle-theme border border-theme">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !isSignUp 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isSignUp 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Status Notifications */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google 1-Click OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-theme bg-card-subtle-theme hover:bg-card-theme hover:border-indigo-500/40 text-theme-primary text-xs font-semibold transition-all shadow-sm group cursor-pointer disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-theme" />
            <span className="absolute bg-card-theme px-3 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
              or with email
            </span>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-theme-secondary">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Khan"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-theme-secondary">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-theme-secondary">
                  Password
                </label>
                {!isSignUp && (
                  <span className="text-[10px] text-indigo-500 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Free Account' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Cloud Sync & Security Badge */}
          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-theme-muted border-t border-theme">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>
              {isSupabaseConfigured 
                ? 'Secured with Supabase Auth & AES-256 Encryption' 
                : 'Local Offline Mode Available'}
            </span>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center text-xs text-theme-muted">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signin');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-indigo-500 hover:underline ml-1"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-indigo-500 hover:underline ml-1"
                >
                  Sign Up Free
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
