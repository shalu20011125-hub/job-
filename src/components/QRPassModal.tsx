import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { InterviewBooking } from '../types/index.ts';
import { X, CheckCircle2, Calendar, Clock, MapPin, Printer, ShieldCheck, Sparkles } from 'lucide-react';

interface QRPassModalProps {
  booking: InterviewBooking | null;
  onClose: () => void;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({ booking, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (booking?.qr_pass_token) {
      QRCode.toDataURL(booking.qr_pass_token, {
        width: 240,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#38bdf8'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [booking]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl shadow-cyan-500/20">
        
        {/* Holographic Glowing Header */}
        <div className="relative bg-gradient-to-r from-cyan-900/60 via-slate-900 to-indigo-950 p-6 border-b border-cyan-500/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Official Event Digital Pass
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            1-on-1 Interview Pass
          </h3>
          <p className="text-xs text-slate-300">
            Show this QR code at the company hiring booth or verification kiosk.
          </p>
        </div>

        {/* Pass Card Body */}
        <div className="p-6 space-y-5">
          {/* Company & Role Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{booking.company_name}</span>
                <h4 className="text-sm font-bold text-white leading-snug">{booking.drive_title}</h4>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {booking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>{booking.interview_date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-semibold text-white">{booking.slot_time}</span>
              </div>
            </div>

            {booking.venue_or_link && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{booking.venue_or_link}</span>
              </div>
            )}
          </div>

          {/* QR Code Presentation */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-cyan-500/50 bg-slate-950/90">
            {qrDataUrl ? (
              <div className="relative p-2 bg-slate-950 rounded-lg border border-cyan-500/40 neon-glow-cyan">
                <img
                  src={qrDataUrl}
                  alt="Candidate Interview Pass QR Code"
                  className="h-44 w-44 rounded-md"
                />
              </div>
            ) : (
              <div className="h-44 w-44 flex items-center justify-center text-xs text-slate-500">
                Generating QR Ticket...
              </div>
            )}

            <div className="mt-3 text-center">
              <p className="text-[11px] text-slate-400">Pass Security Token</p>
              <p className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
                {booking.qr_pass_token}
              </p>
            </div>
          </div>

          {/* Candidate Profile summary on pass */}
          <div className="space-y-1 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Candidate:</span>
              <span className="font-medium text-white">{booking.candidate_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-medium text-slate-300">{booking.candidate_email}</span>
            </div>
            {booking.skills && (
              <div className="flex justify-between">
                <span className="text-slate-500">Verified Skills:</span>
                <span className="font-medium text-cyan-300 truncate max-w-[200px]">{booking.skills}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/25"
          >
            <Sparkles className="h-4 w-4" />
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
