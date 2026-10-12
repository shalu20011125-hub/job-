import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  LayoutDashboard, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock4, 
  ExternalLink, 
  PlusCircle, 
  Sparkles, 
  Search, 
  Filter,
  UserCheck, 
  Briefcase,
  AlertCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Send
} from 'lucide-react';

export const Dashboard = ({ onNavigate, onViewQRPass }) => {
  const { user, switchDemoUser } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('slots');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // New Drive Form state for recruiters
  const [newDrive, setNewDrive] = useState({
    company_name: user?.company_name || 'My Tech Company',
    drive_title: '',
    role_category: 'AI / Machine Learning',
    drive_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    drive_time: '10:00 AM - 04:00 PM',
    drive_mode: 'Online',
    venue_or_link: 'Google Meet Nexus Hall',
    description: '',
    salary_range: '$120k - $160k',
    open_positions: 5,
    requirements: '',
    tags: 'React, Node.js, Cloud',
  });
  const [creatingDrive, setCreatingDrive] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch bookings
      const bookingsRes = await fetch(
        user?.role === 'recruiter' 
          ? `/api/bookings?recruiter_id=${user.id}`
          : `/api/bookings?candidate_id=${user?.id || 1}`
      );
      const bookingsData = await bookingsRes.json();
      if (bookingsData.bookings) {
        setBookings(bookingsData.bookings);
      }

      // Fetch drives
      const drivesRes = await fetch('/api/drives');
      const drivesData = await drivesRes.json();
      if (drivesData.drives) {
        setDrives(drivesData.drives);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        setActionMsg({ text: `Applicant status updated to '${newStatus}'.`, type: 'success' });
        setTimeout(() => setActionMsg(null), 3000);
      } else {
        setActionMsg({ text: data.error || 'Failed to update status', type: 'error' });
      }
    } catch {
      setActionMsg({ text: 'Error contacting server', type: 'error' });
    }
  };

  const handleCreateDriveSubmit = async (e) => {
    e.preventDefault();
    if (!newDrive.drive_title || !newDrive.description) {
      setActionMsg({ text: 'Title and description are required.', type: 'error' });
      return;
    }

    setCreatingDrive(true);
    try {
      const res = await fetch('/api/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDrive,
          recruiter_id: user?.id || 2,
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg({ text: 'New Hiring Drive published successfully!', type: 'success' });
        setDrives(prev => [data.drive, ...prev]);
        setActiveTab('slots');
        setTimeout(() => setActionMsg(null), 3000);
      } else {
        setActionMsg({ text: data.error || 'Failed to publish drive', type: 'error' });
      }
    } catch {
      setActionMsg({ text: 'Server error while publishing hiring drive', type: 'error' });
    } finally {
      setCreatingDrive(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.candidate_name && b.candidate_name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (b.company_name && b.company_name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (b.drive_title && b.drive_title.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (b.skills && b.skills.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-7xl">
        
        {/* Header with Role indicator & Quick role switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              <LayoutDashboard className="h-4 w-4" /> Live Operational Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              {user?.role === 'candidate' ? 'Candidate Interview & Pass Portal' : 'Recruiter Drive & Applicant Control Center'}
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                user?.role === 'candidate'
                  ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                  : 'bg-purple-950 text-purple-400 border-purple-800'
              }`}>
                {user?.role?.toUpperCase()}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as <b className="text-white">{user?.full_name}</b> ({user?.email})
            </p>
          </div>

          {/* Quick toggle between candidate and recruiter test perspectives */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Switch Perspective:</span>
            <button
              onClick={() => switchDemoUser('candidate')}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                user?.role === 'candidate'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => switchDemoUser('recruiter')}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                user?.role === 'recruiter'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionMsg && (
          <div className={`mb-6 flex items-center gap-2 rounded-xl p-3 text-xs animate-fadeIn border ${
            actionMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <span className="text-xs text-slate-400">Total Scheduled Slots</span>
            <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">{bookings.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Confirmed 1-on-1 Interviews</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <span className="text-xs text-slate-400">Shortlisted / Advanced</span>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {bookings.filter(b => b.status === 'Shortlisted' || b.status === 'Passed').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">High Evaluation Priority</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <span className="text-xs text-slate-400">Active Fair Drives</span>
            <p className="text-2xl font-bold font-mono text-purple-400 mt-1">{drives.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">In Platform Database</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <span className="text-xs text-slate-400">Digital QR Verification</span>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-1">Ready</p>
            <p className="text-[11px] text-slate-500 mt-1">Encrypted Entrance Pass</p>
          </div>
        </div>

        {/* RECRUITER SPECIFIC TABS */}
        {user?.role === 'recruiter' && (
          <div className="flex border-b border-slate-800 mb-6 gap-2">
            <button
              onClick={() => setActiveTab('slots')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'slots'
                  ? 'border-purple-400 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Applicant Tracking Panel ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('createDrive')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'createDrive'
                  ? 'border-purple-400 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              Post New Company Hiring Drive
            </button>
          </div>
        )}

        {/* VIEW 1: RECRUITER CREATE DRIVE FORM */}
        {user?.role === 'recruiter' && activeTab === 'createDrive' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 mb-8 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-purple-400" />
              Create &amp; Publish IT Hiring Drive
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Published drives will appear instantly on the Job Fair Catalog and allow candidates to reserve 1-on-1 interview slots.
            </p>

            <form onSubmit={handleCreateDriveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newDrive.company_name}
                    onChange={(e) => setNewDrive({ ...newDrive, company_name: e.target.value })}
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Drive Title</label>
                  <input
                    type="text"
                    value={newDrive.drive_title}
                    onChange={(e) => setNewDrive({ ...newDrive, drive_title: e.target.value })}
                    placeholder="e.g. Lead React & Full-Stack Architect Drive"
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newDrive.role_category}
                    onChange={(e) => setNewDrive({ ...newDrive, role_category: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Frontend Engineering">Frontend Engineering</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Drive Date</label>
                  <input
                    type="date"
                    value={newDrive.drive_date}
                    onChange={(e) => setNewDrive({ ...newDrive, drive_date: e.target.value })}
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Participation Mode</label>
                  <select
                    value={newDrive.drive_mode}
                    onChange={(e) => setNewDrive({ ...newDrive, drive_mode: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Venue or Meeting Link</label>
                  <input
                    type="text"
                    value={newDrive.venue_or_link}
                    onChange={(e) => setNewDrive({ ...newDrive, venue_or_link: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newDrive.salary_range}
                    onChange={(e) => setNewDrive({ ...newDrive, salary_range: e.target.value })}
                    placeholder="$110k - $150k"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Open Positions</label>
                  <input
                    type="number"
                    value={newDrive.open_positions}
                    onChange={(e) => setNewDrive({ ...newDrive, open_positions: parseInt(e.target.value, 10) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description</label>
                <textarea
                  value={newDrive.description}
                  onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                  rows={2}
                  placeholder="Overview of the engineering role and responsibilities..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requirements &amp; Tech Stack Tags</label>
                <input
                  type="text"
                  value={newDrive.tags}
                  onChange={(e) => setNewDrive({ ...newDrive, tags: e.target.value })}
                  placeholder="React, TypeScript, GraphQL, PostgreSQL"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('slots')}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDrive}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-pink-400"
                >
                  {creatingDrive ? 'Publishing...' : 'Publish Hiring Drive'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 2: CANDIDATE QR PASSES & INTERVIEWS / RECRUITER APPLICANT TRACKER */}
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by name, company, or skills..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Status:
              </span>
              {['All', 'Confirmed', 'Shortlisted', 'Passed', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings / Passes Display */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
              <p className="mt-3 text-xs text-slate-400">Loading interview records from database...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center">
              <QrCode className="mx-auto h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">No interview bookings found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {user?.role === 'candidate' 
                  ? 'You haven\'t booked any 1-on-1 interview slots yet. Explore the hiring drives catalog to secure your slot!'
                  : 'No applicants have booked interview slots for your drives matching this filter.'}
              </p>
              {user?.role === 'candidate' && (
                <button
                  onClick={() => onNavigate('booking')}
                  className="mt-4 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
                >
                  Book 1-on-1 Interview Now
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Status & QR Token */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-mono text-cyan-400 block font-bold">
                          {b.qr_pass_token}
                        </span>
                        <h4 className="text-base font-bold text-white leading-tight mt-0.5">
                          {user?.role === 'candidate' ? b.drive_title : b.candidate_name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {user?.role === 'candidate' ? b.company_name : b.candidate_email}
                        </p>
                      </div>

                      {/* Status indicator */}
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                        b.status === 'Confirmed'
                          ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                          : b.status === 'Shortlisted'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : b.status === 'Passed'
                          ? 'bg-purple-950/80 text-purple-400 border-purple-800'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    {/* Slot details */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{b.interview_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="font-bold text-white">{b.slot_time}</span>
                      </div>
                    </div>

                    {/* Candidate specific attributes */}
                    {b.skills && (
                      <div className="text-xs mb-3 text-slate-300">
                        <span className="text-slate-500 font-semibold block mb-0.5">Skills:</span>
                        <p className="text-cyan-300 font-mono text-[11px] bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 truncate">
                          {b.skills}
                        </p>
                      </div>
                    )}

                    {b.resume_link && (
                      <div className="mb-4">
                        <a
                          href={b.resume_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Candidate Portfolio / Resume</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* View Digital QR Pass button */}
                    <button
                      onClick={() => onViewQRPass(b)}
                      className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 transition-colors shadow-sm"
                    >
                      <QrCode className="h-4 w-4 text-cyan-400" />
                      <span>View Digital QR Pass</span>
                    </button>

                    {/* Recruiter Evaluation Status Controls */}
                    {user?.role === 'recruiter' && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">Review:</span>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Shortlisted')}
                          className="rounded-lg bg-emerald-950/80 px-2 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Passed')}
                          className="rounded-lg bg-purple-950/80 px-2 py-1 text-[11px] font-bold text-purple-400 border border-purple-800 hover:bg-purple-900"
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Rejected')}
                          className="rounded-lg bg-rose-950/80 px-2 py-1 text-[11px] font-bold text-rose-400 border border-rose-800 hover:bg-rose-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
