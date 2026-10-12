import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  LogIn, 
  Mail, 
  Lock, 
  UserCheck, 
  Briefcase, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

export const Login = ({ onNavigate }) => {
  const { login } = useAuth();
  
  const [role, setRole] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password, role);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(`Welcome back! Authenticated as ${role}. Redirecting to dashboard...`);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 700);
    } else {
      setErrors({ general: result.error || 'Authentication failed. Please verify credentials.' });
    }
  };

  const fillQuickDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'candidate') {
      setEmail('alex.candidate@nexus.dev');
      setPassword('password123');
    } else {
      setEmail('sarah.recruiter@cyberai.io');
      setPassword('password123');
    }
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
      
      {/* Background Neon ambient orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-600/15 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl"></div>

      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all">
          
          {/* Top subtle glow bar */}
          <div className={`h-1 w-full rounded-t-2xl absolute top-0 left-0 transition-colors duration-300 ${
            role === 'candidate' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`} />

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
              <LogIn className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Sign In to NexusHire Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select your role and enter credentials to access your hiring terminal.
            </p>
          </div>

          {/* Role Segmented Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'candidate'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Candidate
            </button>

            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'recruiter'
                  ? 'bg-purple-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Recruiter
            </button>
          </div>

          {/* Alerts */}
          {errors.general && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work / Academic Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder={role === 'candidate' ? 'alex.candidate@nexus.dev' : 'sarah.recruiter@cyberai.io'}
                  className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                    errors.email 
                      ? 'border-rose-500/60 focus:border-rose-400' 
                      : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                    errors.password 
                      ? 'border-rose-500/60 focus:border-rose-400' 
                      : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-slate-950 transition-all shadow-lg ${
                role === 'candidate'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-cyan-500/25'
                  : 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 shadow-purple-500/25 text-white'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <span>Validating Session...</span>
              ) : (
                <>
                  <span>Sign In as {role === 'candidate' ? 'Candidate' : 'Recruiter'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo autofill helpers */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2.5 font-medium">
              <Zap className="h-3 w-3 text-amber-400" />
              1-Click Demo Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickDemo('candidate')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-cyan-800/60 bg-cyan-950/40 py-2 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Candidate Demo
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('recruiter')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-800/60 bg-purple-950/40 py-2 text-[11px] font-semibold text-purple-300 hover:bg-purple-900/40 transition-colors"
              >
                <Briefcase className="h-3 w-3" />
                Recruiter Demo
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-cyan-400 hover:underline"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
