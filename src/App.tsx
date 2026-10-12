/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Home } from './pages/Home.jsx';
import { EventBooking } from './pages/EventBooking.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { QRPassModal } from './components/QRPassModal.tsx';
import { VSCodeGuideModal } from './components/VSCodeGuideModal.tsx';
import { InterviewBooking } from './types/index.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'booking' | 'dashboard' | 'login' | 'register'>('home');
  const [selectedDriveId, setSelectedDriveId] = useState<number | undefined>(undefined);
  const [activeQRBooking, setActiveQRBooking] = useState<InterviewBooking | null>(null);
  const [isVSCodeGuideOpen, setIsVSCodeGuideOpen] = useState(false);

  const handleNavigate = (page: string, driveId?: number) => {
    if (driveId !== undefined) {
      setSelectedDriveId(driveId);
    }
    setCurrentPage(page as 'home' | 'booking' | 'dashboard' | 'login' | 'register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking: InterviewBooking) => {
    setActiveQRBooking(booking);
  };

  const handleViewQRPass = (booking: InterviewBooking) => {
    setActiveQRBooking(booking);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        
        {/* Navigation Bar */}
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenVSCodeGuide={() => setIsVSCodeGuideOpen(true)}
        />

        {/* Page Switcher */}
        <main className="flex-1">
          {currentPage === 'home' && (
            <Home 
              onNavigate={handleNavigate} 
              onOpenVSCodeGuide={() => setIsVSCodeGuideOpen(true)}
            />
          )}

          {currentPage === 'booking' && (
            <EventBooking 
              selectedDriveId={selectedDriveId}
              onNavigate={handleNavigate}
              onBookingSuccess={handleBookingSuccess}
            />
          )}

          {currentPage === 'dashboard' && (
            <Dashboard 
              onNavigate={handleNavigate}
              onViewQRPass={handleViewQRPass}
            />
          )}

          {currentPage === 'login' && (
            <Login onNavigate={handleNavigate} />
          )}

          {currentPage === 'register' && (
            <Register onNavigate={handleNavigate} />
          )}
        </main>

        {/* Modals */}
        <QRPassModal 
          booking={activeQRBooking}
          onClose={() => setActiveQRBooking(null)}
        />

        <VSCodeGuideModal
          isOpen={isVSCodeGuideOpen}
          onClose={() => setIsVSCodeGuideOpen(false)}
        />

      </div>
    </AuthProvider>
  );
}
