import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Briefcase, 
  Sparkles, 
  CalendarCheck, 
  LayoutDashboard, 
  UserCheck, 
  Terminal, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ArrowLeftRight 
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, driveId?: number) => void;
  onOpenVSCodeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenVSCodeGuide }) => {
  const { user, logout, switchDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex cursor-pointer items-center gap-3 transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/20">
            <Briefcase className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">NEXUS<span className="text-cyan-400 font-extrabold">HIRE</span></span>
              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                Fair 2026
              </span>
            </div>
            <p className="hidden text-[10px] font-medium text-slate-400 sm:block">Career & Hiring Hub</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all ${
              currentPage === 'home'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Job Fair Hub
          </button>

          <button
            onClick={() => onNavigate('booking')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all ${
              currentPage === 'booking'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            Book Slot
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all ${
              currentPage === 'dashboard'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
            {user?.role === 'candidate' && (
              <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.2 text-[11px] font-mono text-cyan-300">QR</span>
            )}
          </button>

          <button
            onClick={onOpenVSCodeGuide}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 hover:border-emerald-500/50 transition-all shadow-sm"
            title="Tamil & English setup instructions for running in VS Code"
          >
            <Terminal className="h-3.5 w-3.5" />
            VS Code Guide
          </button>
        </nav>

        {/* User Role & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Role Toggle for fast reviewer testing */}
          {user && (
            <div className="hidden lg:flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => switchDemoUser('candidate')}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'candidate'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="h-3 w-3" />
                Candidate
              </button>
              <button
                onClick={() => switchDemoUser('recruiter')}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'recruiter'
                    ? 'bg-purple-500 text-white font-bold shadow-sm shadow-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="h-3 w-3" />
                Recruiter
              </button>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full border-2 border-cyan-500/50 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.full_name}</p>
                  <p className="text-[10px] text-cyan-400 capitalize font-mono">
                    {user.role} {user.company_name ? `• ${user.company_name}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Register
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-800/60 bg-slate-950/95 px-4 py-2 justify-around text-xs">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          <Sparkles className="h-4 w-4" />
          Catalog
        </button>
        <button
          onClick={() => onNavigate('booking')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'booking' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          <CalendarCheck className="h-4 w-4" />
          Slots
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'dashboard' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button
          onClick={onOpenVSCodeGuide}
          className="flex flex-col items-center gap-1 text-emerald-400"
        >
          <Terminal className="h-4 w-4" />
          VS Code
        </button>
      </div>
    </header>
  );
};
