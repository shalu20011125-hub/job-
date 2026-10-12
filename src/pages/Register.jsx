import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Code2, 
  Link as LinkIcon, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Register = ({ onNavigate }) => {
  const { register } = useAuth();

  const [role, setRole] = useState('candidate');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    skills: '',
    resume_link: '',
    company_name: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.full_name.trim()) {
      errs.full_name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (role === 'candidate') {
      if (!formData.skills.trim()) {
        errs.skills = 'Please specify at least 1 or 2 core skills / tech stacks.';
      }
      if (!formData.resume_link.trim()) {
        errs.resume_link = 'Resume or portfolio URL is required for recruiter evaluation.';
      } else if (!/^https?:\/\//i.test(formData.resume_link)) {
        errs.resume_link = 'URL must start with http:// or https:// (e.g. GitHub/Drive link).';
      }
    }

    if (role === 'recruiter') {
      if (!formData.company_name.trim()) {
        errs.company_name = 'Company / Organization name is required for recruiter accounts.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      ...formData,
      role
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(`Welcome to NexusHire! Your ${role} profile has been provisioned. Redirecting...`);
      setTimeout(() => {
        onNavigate('home');
      }, 800);
    } else {
      setErrors({ general: result.error || 'Registration failed. Please check inputs.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-600/15 blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl"></div>

      <div className="w-full max-w-xl">
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          
          <div className="h-1 w-full rounded-t-2xl absolute top-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create Your Event Pass Account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Join top IT hiring drives, interview directly with tech leaders, and manage passes.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setRole('candidate');
                setErrors({});
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'candidate'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              I'm a Job Seeker / Candidate
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('recruiter');
                setErrors({});
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'recruiter'
                  ? 'bg-purple-500 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4" />
              I'm a Company Recruiter
            </button>
          </div>

          {/* Alerts */}
          {errors.general && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                      errors.full_name ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                </div>
                {errors.full_name && <p className="mt-1 text-[11px] text-rose-400">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>}
              </div>
            </div>

            {/* Password & Company (or Phone) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                      errors.password ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-[11px] text-rose-400">{errors.password}</p>}
              </div>

              {role === 'recruiter' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hiring Organization / Company *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="e.g. CyberAI Labs"
                      className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                        errors.company_name ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                  </div>
                  {errors.company_name && <p className="mt-1 text-[11px] text-rose-400">{errors.company_name}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0192"
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 px-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Candidate specific: Skills and Resume Link */}
            {role === 'candidate' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Technical Skills &amp; Frameworks *
                  </label>
                  <div className="relative">
                    <Code2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. React, Node.js, TypeScript, PostgreSQL, Docker"
                      className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                        errors.skills ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                  </div>
                  {errors.skills ? (
                    <p className="mt-1 text-[11px] text-rose-400">{errors.skills}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500">Comma-separated key skills for automated recruiter filtering.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Resume Link / Portfolio / LinkedIn URL *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="url"
                      value={formData.resume_link}
                      onChange={(e) => setFormData({ ...formData, resume_link: e.target.value })}
                      placeholder="https://github.com/my-profile or https://drive.google.com/..."
                      className={`w-full rounded-xl bg-slate-950/80 border py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-600 transition-all focus:outline-none ${
                        errors.resume_link ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                  </div>
                  {errors.resume_link && <p className="mt-1 text-[11px] text-rose-400">{errors.resume_link}</p>}
                </div>
              </>
            )}

            {/* Recruiter special skills */}
            {role === 'recruiter' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hiring Focus / Domains
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Full-Stack, AI Engineers, Site Reliability"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 px-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow-lg ${
                role === 'candidate'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25'
                  : 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-white shadow-purple-500/25'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <span>Registering Account in Database...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Complete {role === 'candidate' ? 'Candidate' : 'Recruiter'} Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an existing registration?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-bold text-cyan-400 hover:underline"
            >
              Log in to your account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
