import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, Server, Laptop, BookOpen, Layers } from 'lucide-react';

interface VSCodeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VSCodeGuideModal: React.FC<VSCodeGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'tamil' | 'english' | 'sql'>('tamil');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const stepsCode = [
    {
      title: '1. Project Clone / VS Code Folder Setup',
      cmd: `# Terminal open panni folder-ku ponga:\ncd nexus-hire-hub\n\n# VS Code-la open panna:\ncode .`
    },
    {
      title: '2. Dependencies Install பண்ணவும் (npm install)',
      cmd: `npm install`
    },
    {
      title: '3. PostgreSQL Database & Tables Setup (schema.sql)',
      cmd: `# PostgreSQL CLI (psql) moolam database create panni schema run pannanum:\ncreatedb nexushire_db\npsql -d nexushire_db -f schema.sql`
    },
    {
      title: '4. Environment Variables (.env file create)',
      cmd: `# Create a .env file in the root directory:\nPORT=3000\nDATABASE_URL=postgres://postgres:your_password@localhost:5432/nexushire_db`
    },
    {
      title: '5. Dev Server Run பண்ணவும் (Full-stack)',
      cmd: `npm run dev\n# Now open browser: http://localhost:3000`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl shadow-cyan-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                VS Code-ல் Full-Stack Setup செய்யும் முறை
                <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[11px] font-mono text-cyan-400 border border-cyan-800">
                  Step-by-Step Guide
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                PostgreSQL, Node.js/Express, மற்றும் 5-Page React Frontend ஒருங்கிணைப்பு
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('tamil')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === 'tamil'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            தமிழ் வழிகாட்டி (Tamil Guide)
          </button>
          <button
            onClick={() => setActiveTab('english')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === 'english'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="h-4 w-4" />
            English Setup & Commands
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === 'sql'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-4 w-4" />
            PostgreSQL Schema Info
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm">
          {activeTab === 'tamil' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <h4 className="text-sm font-bold text-cyan-300 mb-1">வணக்கம்! VS Code-ல் இந்த ப்ராஜெக்ட்டை ரன் செய்ய எளிய 5 வழிகள்:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  நீங்கள் கேட்ட 5 பக்கங்கள் (<code className="text-cyan-300">Login</code>, <code className="text-cyan-300">Register</code>, <code className="text-cyan-300">Home</code>, <code className="text-cyan-300">EventBooking</code>, <code className="text-cyan-300">Dashboard</code>), Express Backend APIs மற்றும் PostgreSQL Schema அனைத்தும் இந்த ப்ராஜெக்ட்டில் முழுமையாக உருவாக்கப்பட்டுள்ளது!
                </p>
              </div>

              <div className="space-y-4">
                {stepsCode.map((step, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-xs flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-bold text-cyan-400">
                          {idx + 1}
                        </span>
                        {step.title}
                      </span>
                      <button
                        onClick={() => copyToClipboard(step.cmd, idx)}
                        className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="rounded-lg bg-black/80 p-3 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800/80">
                      {step.cmd}
                    </pre>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 text-xs">
                <p className="font-semibold text-purple-300 mb-1">💡 முக்கிய குறிப்பு (Quick Tip):</p>
                <p className="text-slate-300">
                  உங்கள் கணினியில் PostgreSQL இல்லையென்றாலும் கவலை வேண்டாம்! நமது பேக்-எண்டில் (<code className="text-purple-300">server/db.ts</code>) ஆட்டோமேட்டிக் <b>In-Memory PostgreSQL Fallback Engine</b> கொடுக்கப்பட்டுள்ளது. எனவே எந்த database error-உம் இன்றி உடனே டெமோ பார்க்க முடியும்!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'english' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-base">File Structure Generated in your Project:</h4>
              <pre className="rounded-xl bg-black/90 p-4 font-mono text-xs text-slate-300 border border-slate-800 leading-relaxed overflow-x-auto">
{`nexus-hire-hub/
├── schema.sql                 # PostgreSQL tables: users, job_drives, interview_bookings
├── server.ts                  # Express REST server with Vite integration
├── server/
│   └── db.ts                  # PostgreSQL Pool + fallback in-memory database adapter
├── src/
│   ├── pages/
│   │   ├── Login.jsx / .tsx   # Candidate & Recruiter Login with validation
│   │   ├── Register.jsx / .tsx# 6-field registration form (Role, Skills, Resume link)
│   │   ├── Home.jsx / .tsx    # IT hiring drives catalog, search, tags, filters
│   │   ├── EventBooking.jsx   # Drive details & interactive 1-on-1 slot picker
│   │   └── Dashboard.jsx      # Candidate QR pass vault & Recruiter applicant tracker
│   ├── components/
│   │   ├── Navbar.tsx         # Modern dark neon navigation bar
│   │   ├── QRPassModal.tsx    # Digital QR pass renderer & print modal
│   │   └── VSCodeGuideModal   # Tamil & English instructions
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication state & role switcher
│   ├── types/index.ts         # TypeScript data contracts
│   └── main.tsx & App.tsx     # Single Page App routing & layout`}
              </pre>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <h5 className="font-bold text-white text-xs mb-2">Available REST Endpoints:</h5>
                <ul className="text-xs space-y-1.5 font-mono text-slate-400">
                  <li><span className="text-emerald-400">POST</span> /api/auth/register - Sign up Candidates & Recruiters</li>
                  <li><span className="text-emerald-400">POST</span> /api/auth/login - Validate credentials & roles</li>
                  <li><span className="text-cyan-400">GET</span>  /api/drives - Filterable IT hiring drives catalog</li>
                  <li><span className="text-cyan-400">GET</span>  /api/drives/:id - Drive requirements & booked slots</li>
                  <li><span className="text-emerald-400">POST</span> /api/drives - Recruiters post new hiring events</li>
                  <li><span className="text-cyan-400">GET</span>  /api/bookings - Candidate tickets or recruiter applicant tracker</li>
                  <li><span className="text-emerald-400">POST</span> /api/bookings - Reserve 1-on-1 interview slot & generate QR token</li>
                  <li><span className="text-amber-400">PATCH</span> /api/bookings/:id/status - Update candidate review status</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <h4 className="font-bold text-white text-xs mb-2">PostgreSQL Relational Schema Highlights:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono block mb-1">users table</span>
                    <p className="text-[11px] text-slate-400">Stores candidate profiles, resumes, skills, and recruiter company affiliations with role validation.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-purple-400 font-mono block mb-1">job_drives table</span>
                    <p className="text-[11px] text-slate-400">FK to users(id). Contains drive date, venue, JSONB slot arrays, categories, and salary ranges.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 font-mono block mb-1">interview_bookings</span>
                    <p className="text-[11px] text-slate-400">FK to users and job_drives with UNIQUE(drive_id, slot_time) constraints to prevent double booking.</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                You can run this anytime in PostgreSQL with: <code className="text-cyan-300 font-mono">psql -d nexushire_db -f schema.sql</code>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
