'use client';

import { useState } from 'react';
import { generateICSFile, generateGoogleCalendarLink, downloadICSFile, CalendarEvent } from '@/utils/calendar';

interface CalendarButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

const eventData: CalendarEvent = {
  title: 'Neuro Reset Awareness Seminar',
  description: 'Prof Andy Hsu & Dr Diana Chan introduce holistic, neuroscience-backed chronic pain management.',
  location: 'West Forum, Trehaus, Funan L3, City Hall',
  startDate: new Date('2025-09-07T15:00:00'),
  endDate: new Date('2025-09-07T16:30:00'),
};

export default function CalendarButton({ className = '', variant = 'primary' }: CalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleICSDownload = () => {
    const icsContent = generateICSFile(eventData);
    downloadICSFile(icsContent, 'neuro-reset-seminar.ics');
    setIsOpen(false);
  };

  const handleGoogleCalendar = () => {
    const googleCalendarLink = generateGoogleCalendarLink(eventData);
    window.open(googleCalendarLink, '_blank');
    setIsOpen(false);
  };

  const baseClasses = 'inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300';
  const variantClasses = variant === 'primary' 
    ? 'bg-gradient-primary text-white hover:shadow-glow transform hover:-translate-y-1' 
    : 'bg-white text-primary border-2 border-primary hover:bg-gray-50 hover:shadow-card';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseClasses} ${variantClasses} ${className}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add to Calendar
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-card z-10 min-w-[200px] backdrop-blur-sm">
          <div className="py-2">
            <button
              onClick={handleICSDownload}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download ICS File
            </button>
            <button
              onClick={handleGoogleCalendar}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Add to Google Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 