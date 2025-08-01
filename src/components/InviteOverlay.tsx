'use client';

import { useEffect, useState } from 'react';

interface InviteOverlayProps {
  onClick: () => void;
  backgroundImage?: string; // Allow custom background image
}

// Background image options
const defaultBackgroundImages = [
  '/assets/banner.jpg',
  '/assets/venue.jpg',
  '/assets/medical-bg.jpg',
];

export default function InviteOverlay({ onClick, backgroundImage }: InviteOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!backgroundImage) {
      const randomIndex = Math.floor(Math.random() * defaultBackgroundImages.length);
      setSelectedImage(defaultBackgroundImages[randomIndex]);
    } else {
      setSelectedImage(backgroundImage);
    }
  }, [backgroundImage]);

  const currentBgImage = selectedImage || defaultBackgroundImages[0];

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${currentBgImage}')`,
            backgroundColor: '#0a0a0a',
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/30 to-amberGlow/70">
        {/* Additional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-transparent to-blue-900/30">
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-amberGlow/60 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-gradientStart/50 rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-1/2 right-20 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-amberGlow/40 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-gradientStart/30 rounded-full animate-pulse delay-1200"></div>
          </div>
        </div>
      </div>

      {/* Content Container - Improved centering with proper dimensions */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className={`max-w-2xl mx-auto text-center text-white transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>

          {/* Elegant Border Frame */}
          <div className="relative p-8 sm:p-10 lg:p-12 border-2 border-white/30 rounded-3xl backdrop-blur-sm bg-white/5 shadow-2xl">
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50 rounded-br-lg"></div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* You're Invited */}
              <div className={`transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-xl font-nunito font-light tracking-[0.3em] uppercase text-white/90 mb-2">
                  You&apos;re Invited
                </h2>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto"></div>
              </div>

              {/* Event Title */}
              <div className={`transition-all duration-1000 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold uppercase tracking-wide leading-tight">
                  Neuro Reset Awareness Seminar
                </h1>
              </div>

              {/* Date and Time */}
              <div className={`transition-all duration-1000 delay-900 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="text-lg md:text-xl font-nunito font-light tracking-wide">
                  <div className="mb-2">7 September 2025</div>
                  <div className="text-white/90">3:00 PM – 4:30 PM</div>
                </div>
              </div>

              {/* Venue */}
              <div className={`transition-all duration-1000 delay-1100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="text-lg font-nunito font-medium">
                  <div className="mb-1">West Forum, Trehaus</div>
                  <div className="text-white/80 font-light">@ Funan, City Hall</div>
                </div>
              </div>

              {/* Subline */}
              <div className={`transition-all duration-1000 delay-1300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-lg font-playfair text-white/70 font-bold italic">
                  &ldquo;Join us for an afternoon of science, healing, and discovery.&rdquo;
                </p>
              </div>

              {/* CTA Button */}
              <div className={`transition-all duration-1000 delay-1500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={onClick}
                  className="group relative inline-flex items-center px-12 py-4 bg-white text-gray-900 font-nunito font-bold rounded-full hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10 text-gray-900">View Details</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className={`mt-8 transition-all duration-1000 delay-1700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClick}
        className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors duration-200"
        aria-label="Close invitation"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
} 