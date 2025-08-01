'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateICSFile, generateGoogleCalendarLink, downloadICSFile, CalendarEvent } from '@/utils/calendar';

interface CalendarButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

const eventData: CalendarEvent = {
  title: 'Neuro Reset Awareness Seminar',
  description: 'This seminar aims to bring awareness around a holistic approach to chronic pain management through non-invasive novel techniques. Featuring Prof Andy Hsu & Dr Diana Chan.',
  location: 'West Forum, Trehaus @ Funan #07-21, 109 North Bridge Road, Singapore 179097',
  startDate: new Date('2025-09-07T15:00:00+08:00'), // 3:00 PM SGT
  endDate: new Date('2025-09-07T16:30:00+08:00'),   // 4:30 PM SGT
};

export default function CalendarButton({ className = '', variant = 'primary' }: CalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleICSDownload = () => {
    const icsContent = generateICSFile(eventData);
    downloadICSFile(icsContent, 'neuro-reset-seminar.ics');
    
    // Provide user feedback
    setTimeout(() => {
      // Close dropdown after brief delay for better UX
      setIsOpen(false);
    }, 300);
  };

  const handleGoogleCalendar = () => {
    const googleCalendarLink = generateGoogleCalendarLink(eventData);
    window.open(googleCalendarLink, '_blank');
    
    // Close dropdown immediately for external link
    setIsOpen(false);
  };

  const baseClasses = 'inline-flex items-center';
  
  // Use custom className if provided, otherwise use variant classes with default styling
  const buttonClasses = className 
    ? `${baseClasses} ${className}`
    : `${baseClasses} px-6 py-3 rounded-full font-nunito font-medium transition-all duration-300 ${variant === 'primary' 
        ? 'bg-gradient-primary text-white hover:shadow-glow transform hover:-translate-y-1' 
        : 'bg-white text-primary border-2 border-primary hover:bg-gray-50 hover:shadow-card'}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonClasses} focus:outline-none focus:ring-0 focus:shadow-none focus:border-transparent`}
        style={{ color: className ? 'black' : undefined }}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke={className ? 'black' : 'currentColor'} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add to Calendar
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke={className ? 'black' : 'currentColor'} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Compact Side Dropdown */}
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full mt-2 left-full ml-3 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-20 min-w-[200px] overflow-hidden"
            >
              <div className="py-1">
                {/* Apple/Outlook/Android Option */}
                <button
                  onClick={handleICSDownload}
                  className="w-full px-4 py-3 text-left hover:bg-primary/5 flex items-center transition-all duration-200 group focus:outline-none"
                >
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors duration-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800 font-nunito text-sm">Apple / Outlook</div>
                    <div className="text-xs text-gray-500 font-nunito">Download .ics file</div>
                  </div>
                </button>
                
                {/* Divider */}
                <div className="h-px bg-gray-100 mx-4"></div>
                
                {/* Google Calendar Option */}
                <button
                  onClick={handleGoogleCalendar}
                  className="w-full px-4 py-3 text-left hover:bg-primary/5 flex items-center transition-all duration-200 group focus:outline-none"
                >
                  <svg className="w-4 h-4 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800 font-nunito text-sm">Google Calendar</div>
                    <div className="text-xs text-gray-500 font-nunito">Open in browser</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 