'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CalendarButton from './CalendarButton';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrantName: string;
}

export default function ConfirmationModal({ isOpen, onClose, registrantName }: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Background with gradient overlay matching event page */}
      <div className="absolute inset-0">
        {/* Base dark overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        {/* Primary to Amber Gradient Overlay - Same as event pages */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to right, rgba(42, 114, 196, 0.7) 0%, rgba(42, 114, 196, 0.4) 50%, rgba(253, 186, 116, 0.7) 100%)
          `
        }}></div>
      </div>
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-card border border-gray-100 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/40 hover:text-black/60 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-2xl font-playfair font-bold text-black mb-3">
            Registration Confirmed
          </h3>
          
          <p className="text-base text-black mb-8 leading-relaxed">
            Thank you, <span className="font-semibold text-black">{registrantName}</span>. Your registration for the Neuro Reset Awareness Seminar has been successfully confirmed.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <h4 className="font-nunito font-semibold text-black mb-4 text-lg">Event Details</h4>
            <div className="text-black space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Date</span>
                <span>September 7, 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Time</span>
                <span>3:00 PM - 4:30 PM</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium">Venue</span>
                <span className="text-right">West Forum, Trehaus<br/>Funan #07-21</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <CalendarButton 
              className="w-full justify-center" 
              variant="primary"
            />
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const eventPageUrl = `https://dexabrain-website-rosy.vercel.app/event/neuro-reset-awareness-seminar`;
                const message = encodeURIComponent(
                  `Hi! I've registered for the Neuro Reset Awareness Seminar on Sept 7, 2025. Would you like to join me?\n\nCheck out the event details and register here:\n${eventPageUrl}`
                );
                window.open(`https://wa.me/?text=${message}`, '_blank');
              }}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-full text-black bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-sm font-nunito font-medium"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Share with Friends
            </motion.button>
          </div>

          <p className="text-sm text-black/70 mt-8 font-nunito">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
} 