import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  Building2, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  Flame,
  Layers,
  Award,
  Video
} from 'lucide-react';

export const Home = ({ onNavigate, onOpenVSCodeGuide }) => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [stats, setStats] = useState({
    totalDrives: 14,
    totalCandidates: 850,
    totalBookings: 320,
    avgHiringRatio: '78%',
    partnerCompanies: 45
  });

  const categories = [
    'All',
    'AI / Machine Learning',
    'Cloud & DevOps',
    'Frontend Engineering',
    'Data & Analytics'
  ];

  const modes = ['All', 'Online', 'In-Person', 'Hybrid'];

  useEffect(() => {
    fetchDrives();
    fetchStats();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drives');
      const data = await res.json();
      if (data.drives) {
        setDrives(data.drives);
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Filter drives based on state
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = 
      drive.drive_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (drive.tags && drive.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (drive.description && drive.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || drive.role_category === selectedCategory;
    const matchesMode = selectedMode === 'All' || drive.drive_mode === selectedMode;

    return matchesSearch && matchesCategory && matchesMode;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 py-16 lg:py-24">
        {/* Glow backdrop elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[450px] w-[800px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-1/3 left-10 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Live Event Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-md shadow-cyan-500/10 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ANNUAL GLOBAL IT HIRING SUMMIT 2026</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-[11px] text-cyan-400 font-bold">LIVE SLOTS OPEN</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Direct Access to Top Tech Drives &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">1-on-1 Interviews</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Skip traditional resume black holes. Connect directly with hiring engineering managers, reserve guaranteed interview time-slots, and receive instant digital QR passes.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById('catalog-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25"
              >
                <Sparkles className="h-4 w-4" />
                Explore Active Hiring Drives
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate('booking')}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all"
              >
                <Clock className="h-4 w-4 text-cyan-400" />
                Book Interview Slot
              </button>

              <button
                onClick={onOpenVSCodeGuide}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900/40 transition-all"
              >
                <span>VS Code Setup Guide (தமிழ் / Eng)</span>
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-md">
              <div className="text-center p-2 border-r border-slate-800/80 last:border-r-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">45+</p>
                <p className="text-xs text-slate-400 mt-1">Tech Enterprises &amp; Startups</p>
              </div>
              <div className="text-center p-2 border-r border-slate-800/80 last:border-r-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">1,200+</p>
                <p className="text-xs text-slate-400 mt-1">Open Engineering Positions</p>
              </div>
              <div className="text-center p-2 border-r border-slate-800/80 last:border-r-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">100%</p>
                <p className="text-xs text-slate-400 mt-1">Guaranteed Recruiter Slots</p>
              </div>
              <div className="text-center p-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">Instant</p>
                <p className="text-xs text-slate-400 mt-1">QR Pass Generation</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED WORKSHOPS & MASTERCLASSES */}
      <section className="py-12 border-b border-slate-900 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                <GraduationCap className="h-4 w-4" /> Career Accelerator Stage
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Fair Day Resume Clinics &amp; Tech Workshops
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Free 45-minute live interactive sessions hosted by Principal Engineers and Staff Recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-cyan-950 px-2.5 py-1 text-[11px] font-mono font-bold text-cyan-400 border border-cyan-800">
                  10:30 AM EST
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Video className="h-3.5 w-3.5 text-cyan-400" /> Virtual Stage 1
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                AI &amp; ATS Resume Optimization Clinic
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Transform your GitHub and project descriptions to survive modern LLM recruiters and automated ATS screenings.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-slate-400">By Sarah Chen (CyberAI)</span>
                <span className="font-bold text-cyan-400">Included with Pass</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-purple-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-purple-950 px-2.5 py-1 text-[11px] font-mono font-bold text-purple-400 border border-purple-800">
                  01:00 PM EST
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Video className="h-3.5 w-3.5 text-purple-400" /> Virtual Stage 2
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                System Design Mock: Microservices at Scale
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Live whiteboarding of distributed caching, event backbones, and database sharding patterns for senior candidates.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-slate-400">By Marcus Vance (CloudPulse)</span>
                <span className="font-bold text-purple-400">Included with Pass</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-emerald-950 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-800">
                  03:30 PM EST
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Video className="h-3.5 w-3.5 text-emerald-400" /> Virtual Stage 3
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Cracking Frontend: React 19 &amp; Next.js Deep-Dive
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Core mental models around Server Components, concurrent hooks, state synchronization, and DOM performance.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-slate-400">By Liam Cross (FinEdge)</span>
                <span className="font-bold text-emerald-400">Included with Pass</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATALOG SECTION: FILTERABLE DRIVE CARDS */}
      <section id="catalog-section" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                <Flame className="h-4 w-4 text-amber-400" /> Active Hiring Opportunities
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                IT Hiring Drives Catalog
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Filter by technical specialization, participation mode, or search by keywords.
              </p>
            </div>

            {/* Quick status count */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 flex items-center gap-3">
              <span className="text-xs text-slate-400">Available Drives:</span>
              <span className="font-mono text-base font-bold text-cyan-400">{filteredDrives.length}</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 mb-8 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drives by title, company, technology (e.g. React, Python, Kubernetes)..."
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills & Mode Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/70">
              
              {/* Specialization Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="h-3 w-3" /> Domain:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Mode Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 rounded-xl p-1 border border-slate-800">
                <span className="text-[11px] text-slate-400 px-2 font-medium">Mode:</span>
                {modes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedMode === mode
                        ? 'bg-slate-800 text-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Drive Cards Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
              <p className="mt-3 text-xs text-slate-400">Loading IT hiring drives from database...</p>
            </div>
          ) : filteredDrives.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">No hiring drives match your search</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try modifying your search query or reset the category filter to view all available hiring events.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedMode('All');
                }}
                className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredDrives.map((drive) => {
                const tagList = drive.tags ? drive.tags.split(',').map(t => t.trim()) : [];
                
                return (
                  <div
                    key={drive.id}
                    className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Company info & Mode badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={drive.company_logo}
                            alt={drive.company_name}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                              {drive.company_name}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {drive.drive_title}
                            </h3>
                          </div>
                        </div>

                        {/* Mode badge */}
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold border ${
                          drive.drive_mode === 'Online'
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80'
                            : drive.drive_mode === 'In-Person'
                            ? 'bg-amber-950/70 text-amber-400 border-amber-800/80'
                            : 'bg-purple-950/70 text-purple-400 border-purple-800/80'
                        }`}>
                          {drive.drive_mode}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                        {drive.description}
                      </p>

                      {/* Metadata Chips: Date, Time, Venue, Salary */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span>{drive.drive_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span>{drive.drive_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="text-emerald-300 font-semibold">{drive.salary_range}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                          <span>{drive.open_positions} Positions</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tagList.map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400">
                        Slots: <span className="text-white font-mono font-bold">{drive.available_slots?.length || 6} windows</span>
                      </span>

                      <button
                        onClick={() => onNavigate('booking', drive.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
                      >
                        <span>Book 1-on-1 Slot</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-300">NEXUSHIRE HUB</span>
            <span>• Full-Stack Event &amp; Career Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenVSCodeGuide} className="hover:text-cyan-400 underline">VS Code Setup Guide</button>
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400">Home</button>
            <button onClick={() => onNavigate('booking')} className="hover:text-cyan-400">Booking</button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400">Dashboard</button>
          </div>
          <p>© 2026 NexusHire Event System. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
