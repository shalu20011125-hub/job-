import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Send,
  User,
  Mail,
  Code2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export const EventBooking = ({ 
  selectedDriveId, 
  onNavigate, 
  onBookingSuccess 
}) => {
  const { user } = useAuth();

  const [drives, setDrives] = useState([]);
  const [activeDrive, setActiveDrive] = useState(null);
  const [takenSlots, setTakenSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields prefilled from current user
  const [candidateName, setCandidateName] = useState(user?.full_name || '');
  const [candidateEmail, setCandidateEmail] = useState(user?.email || '');
  const [candidateSkills, setCandidateSkills] = useState(user?.skills || 'React, TypeScript, Node.js');
  const [resumeLink, setResumeLink] = useState(user?.resume_link || 'https://github.com/my-portfolio');

  useEffect(() => {
    loadDrives();
  }, [selectedDriveId]);

  useEffect(() => {
    if (user) {
      setCandidateName(user.full_name || '');
      setCandidateEmail(user.email || '');
      if (user.skills) setCandidateSkills(user.skills);
      if (user.resume_link) setResumeLink(user.resume_link);
    }
  }, [user]);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drives');
      const data = await res.json();
      if (data.drives && data.drives.length > 0) {
        setDrives(data.drives);
        const initial = selectedDriveId 
          ? data.drives.find((d) => d.id === selectedDriveId) || data.drives[0]
          : data.drives[0];
        setActiveDrive(initial);
        loadDriveDetails(initial.id);
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDriveDetails = async (id) => {
    try {
      const res = await fetch(`/api/drives/${id}`);
      const data = await res.json();
      if (data.drive) {
        setActiveDrive(data.drive);
        setTakenSlots(data.takenSlots || []);
        setSelectedSlot('');
      }
    } catch (err) {
      console.error('Failed to load drive details:', err);
    }
  };

  const handleSelectDrive = (drive) => {
    setActiveDrive(drive);
    setErrorMsg('');
    setSuccessMsg('');
    loadDriveDetails(drive.id);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!activeDrive) return;

    if (!selectedSlot) {
      setErrorMsg('Please select an available 1-on-1 interview time slot below.');
      return;
    }

    if (!candidateName.trim() || !candidateEmail.trim()) {
      setErrorMsg('Candidate full name and email are required.');
      return;
    }

    if (!resumeLink.trim()) {
      setErrorMsg('Please provide your portfolio or resume link for recruiter review.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drive_id: activeDrive.id,
          candidate_id: user?.id || 1,
          slot_time: selectedSlot,
          interview_date: activeDrive.drive_date,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          resume_link: resumeLink,
          skills: candidateSkills,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to reserve slot.');
        setSubmitting(false);
        return;
      }

      setSuccessMsg('Slot confirmed! Digital QR Pass has been created.');
      setTakenSlots(prev => [...prev, selectedSlot]);
      
      // Notify parent to show QR Modal
      if (data.booking) {
        onBookingSuccess(data.booking);
      }
    } catch {
      setErrorMsg('Network error while booking interview slot. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400">Loading drive details and live interview slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Slot Reservation Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Drive Details &amp; 1-on-1 Interview Booking
            </h1>
          </div>

          {/* Quick Drive Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Drive:</span>
            <select
              value={activeDrive?.id || ''}
              onChange={(e) => {
                const found = drives.find(d => d.id === parseInt(e.target.value, 10));
                if (found) handleSelectDrive(found);
              }}
              className="rounded-xl border border-slate-700 bg-slate-900 py-2 px-3 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
            >
              {drives.map(d => (
                <option key={d.id} value={d.id}>
                  {d.company_name} — {d.drive_title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeDrive && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: COMPANY DRIVE DETAILS & REQUIREMENTS (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Drive Hero Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-indigo-500 absolute top-0 left-0" />

                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeDrive.company_logo}
                      alt={activeDrive.company_name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                    />
                    <div>
                      <span className="rounded-full bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        {activeDrive.role_category}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {activeDrive.drive_title}
                      </h2>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">
                        {activeDrive.company_name}
                      </p>
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold border ${
                    activeDrive.drive_mode === 'Online'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : activeDrive.drive_mode === 'In-Person'
                      ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                      : 'bg-purple-950/80 text-purple-400 border-purple-800'
                  }`}>
                    {activeDrive.drive_mode}
                  </span>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-xs mb-6">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Date</span>
                    <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" /> {activeDrive.drive_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Window</span>
                    <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" /> {activeDrive.drive_time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Compensation</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {activeDrive.salary_range}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Openings</span>
                    <span className="font-bold text-purple-400 mt-0.5 block">
                      {activeDrive.open_positions} Positions
                    </span>
                  </div>
                </div>

                {/* Venue or Link */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 mb-6">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">Venue / Platform:</span>
                  <span className="font-semibold text-white">{activeDrive.venue_or_link}</span>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                      About the Hiring Drive
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeDrive.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                      Job Requirements &amp; Eligibility
                    </h3>
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeDrive.requirements}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                      Primary Tech Stack Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDrive.tags && activeDrive.tags.split(',').map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-cyan-300 border border-slate-700"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: INTERACTIVE 1-ON-1 SLOT PICKER & BOOKING FORM (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 backdrop-blur-xl shadow-xl">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Select Interview Slot</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">1-on-1 • 30 mins</span>
                </div>

                {/* Status messages */}
                {errorMsg && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Interactive Slots Grid */}
                <div className="mb-6">
                  <p className="text-[11px] text-slate-400 mb-2.5">
                    Available recruiter windows for <b className="text-white">{activeDrive.drive_date}</b>:
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {activeDrive.available_slots?.map((slot) => {
                      const isTaken = takenSlots.includes(slot);
                      const isSelected = selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setErrorMsg('');
                          }}
                          className={`relative flex flex-col items-center justify-center rounded-xl p-3 text-xs transition-all border ${
                            isTaken
                              ? 'border-slate-800/80 bg-slate-950/40 text-slate-600 cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 font-extrabold neon-border-cyan shadow-md'
                              : 'border-slate-800 bg-slate-950/90 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900'
                          }`}
                        >
                          <span className="font-mono text-xs">{slot}</span>
                          <span className="text-[9px] mt-0.5">
                            {isTaken ? 'Reserved' : isSelected ? 'Selected' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Candidate Verification Form */}
                <form onSubmit={handleConfirmBooking} className="space-y-4 pt-4 border-t border-slate-800">
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Candidate Entry Information
                  </p>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Candidate Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Alex Rivera"
                        required
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Email for QR Pass Delivery *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="email"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        placeholder="alex.candidate@nexus.dev"
                        required
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Core Skills Summary
                    </label>
                    <div className="relative">
                      <Code2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={candidateSkills}
                        onChange={(e) => setCandidateSkills(e.target.value)}
                        placeholder="React, TypeScript, Node.js"
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Resume Link / Portfolio *
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="url"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        placeholder="https://github.com/..."
                        required
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="rounded-xl bg-slate-950/80 p-3 text-xs border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Selected Slot:</span>
                      <span className="font-mono font-bold text-cyan-400">{selectedSlot || 'None selected'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Pass Format:</span>
                      <span className="text-emerald-400 font-semibold">Digital Encrypted QR Pass</span>
                    </div>
                  </div>

                  {/* Submit Booking */}
                  <button
                    type="submit"
                    disabled={submitting || !selectedSlot}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span>Reserving Slot in PostgreSQL...</span>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Confirm Slot &amp; Generate QR Pass</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
