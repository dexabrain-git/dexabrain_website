'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import ConfirmationModal from './ConfirmationModal';
import RegistrationModal from './RegistrationModal';

interface AttendeeData {
  name: string;
  email: string;
  phone: string;
}

interface RegistrationData {
  numberOfPax: number;
  primaryAttendee: AttendeeData;
  additionalAttendees: AttendeeData[];
  referralCode?: string;
  consentGiven: boolean;
}

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Event date: September 7, 2025 at 3:00 PM SGT
    const eventDate = new Date('2025-09-07T15:00:00+08:00');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="grid grid-cols-4 gap-4 lg:gap-8 max-w-3xl mx-auto mb-12"
    >
      {[
        { value: timeLeft.days.toString().padStart(2, '0'), label: 'DAYS' },
        { value: timeLeft.hours.toString().padStart(2, '0'), label: 'HOURS' },
        { value: timeLeft.minutes.toString().padStart(2, '0'), label: 'MINUTES' },
        { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'SECONDS' }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
        >
          <div className="text-5xl lg:text-7xl font-bold text-white mb-2 drop-shadow-lg font-nunito">
            {item.value}
          </div>
          <div className="text-sm lg:text-base font-nunito text-white/80 uppercase tracking-wider font-medium">
            {item.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function MainEventPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [registrantName, setRegistrantName] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegistrationData>();

  const onSubmit = async (data: RegistrationData) => {
    // Handle registration logic here
    setRegistrantName(data.name);
    setShowConfirmation(true);
    reset();
  };

  const handleRegistrationSubmit = (data: RegistrationData) => {
    // Handle registration logic here
    setRegistrantName(data.primaryAttendee.name);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Inspired by reference design */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/assets/hero-background-placeholder.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Show placeholder if image doesn't load
              const target = e.currentTarget;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          {/* Placeholder overlay when image is not found */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800" style={{ display: 'none' }}>
            <div className="text-white/50 text-center">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg font-nunito">Replace hero-background-placeholder.jpg</p>
              <p className="text-sm font-nunito text-white/30 mt-2">in /public/assets/ folder</p>
            </div>
          </div>
          {/* Base dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Bottom Half Gradient Overlay - Primary to Amber left-to-right */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.3) 100%),
              linear-gradient(to right, rgba(42, 114, 196, 0.7) 0%, rgba(42, 114, 196, 0.4) 50%, rgba(253, 186, 116, 0.7) 100%)
            `,
            maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)'
          }}></div>
        </div>

        {/* Logo - Absolute Position */}
        <div className="absolute -top-4 left-8 z-30">
          <img 
            src="/assets/dexabrain-logo.png" 
            alt="Dexabrain Logo" 
            className="h-40 w-auto"
            onError={(e) => {
              // Fallback to text if logo doesn't exist
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-2xl font-playfair font-bold text-white" style={{ display: 'none' }}>
            DEXABRAIN
          </span>
        </div>

        {/* Navigation - Restored Original Position */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-8 mr-4">
              <div className="hidden md:flex space-x-8 text-white/80 font-nunito">
                <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
                <a href="#about" className="hover:text-white transition-colors">SPEAKERS</a>
                <a href="#learn" className="hover:text-white transition-colors">LEARN</a>
                <a href="#register" className="hover:text-white transition-colors">REGISTER</a>
              </div>
              <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full font-nunito font-bold hover:bg-white/30 transition-colors">
                CONTACT
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center lg:gap-16">
            {/* Left Side - Empty space or additional content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* This space can be used for additional content if needed */}
            </motion.div>

            {/* Right Side - Main Content - Moved slightly right */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white ml-20"
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold mb-6 leading-tight drop-shadow-lg">
                Neuro Reset Awareness Seminar
            </h2>
              
              <p className="text-lg lg:text-xl font-nunito text-white/80 mb-8 leading-relaxed">
              This seminar aims to bring awareness around a holistic approach to chronic pain management through non-invasive novel techniques.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Date and Reserve Button - Bottom Left with margin */}
        <div className="absolute bottom-40 left-40 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white"
          >
            <p className="text-md font-nunito text-white/70 uppercase tracking-wider mb-4">
              7 SEPTEMBER 2025 • FREE SEMINAR
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRegistration(true)}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-nunito font-medium hover:bg-white/30 transition-all duration-300"
            >
              RESERVE A SPOT
            </motion.button>
          </motion.div>
        </div>

        {/* See More About Us - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center space-x-4 text-white/70 font-nunito"
          >
            <span>See more about us</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        {/* Social Links */}
        <div className="absolute bottom-8 right-8 z-20 hidden lg:flex space-x-4">
          {[
            { name: 'facebook', icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )},
            { name: 'twitter', icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            )},
            { name: 'linkedin', icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            )},
            { name: 'instagram', icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            )}
          ].map((social, index) => (
            <motion.a
              key={social.name}
              href={`#${social.name}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label={`Follow us on ${social.name}`}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </section>

      {/* Section 2: About the Event - WHO WE ARE */}
      <section id="about" className="relative min-h-screen flex items-center">
        {/* Background with image and continuous overlay from hero */}
        <div className="absolute inset-0">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/about-background-placeholder.jpg')`,
              backgroundColor: '#1e293b', // Fallback color
            }}
          />
          <img 
            src="/assets/about-background-placeholder.jpg"
            alt=""
            className="hidden"
            onError={(e) => {
              // Show placeholder if image doesn't load
              const target = e.currentTarget;
              const parent = target.parentElement?.parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
          {/* Image Placeholder when image is not found */}
          <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-slate-800" style={{ display: 'none' }}>
            <div className="text-white/50 text-center">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg font-nunito">Replace about-background-placeholder.jpg</p>
              <p className="text-sm font-nunito text-white/30 mt-2">in /public/assets/ folder</p>
            </div>
          </div>

          {/* Base dark overlay for readability - Same as hero */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Primary to Amber Gradient Overlay - Same structure as hero */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%),
              linear-gradient(to right, rgba(42, 114, 196, 0.7) 0%, rgba(42, 114, 196, 0.4) 50%, rgba(253, 186, 116, 0.7) 100%)
            `
          }}></div>
        </div>

        {/* Content - Centered layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-center min-h-screen">
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold mb-6 leading-tight drop-shadow-lg">
                What <span className="text-primary">We Do</span>
              </h2>
              
              <p className="text-lg font-nunito text-white/80 mb-8 leading-relaxed">
                At Dexa Brain, we are committed to advancing health through the latest developments in neuroscience. We believe that by engaging and empowering communities, we can help individuals manage pain more effectively.
              </p>
              
              <p className="text-lg font-nunito text-white/70 mb-10 leading-relaxed">
                Join us for this free seminar and discover how chronic pain can be managed holistically with Prof Andy Hsu and Dr Diana Chan.
              </p>
            </motion.div>

            {/* Right: Speaker Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Speaker Card 1 - Prof Andy Hsu */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500 hover:transform hover:scale-[1.02] shadow-2xl"
              >
                <div className="flex h-64">
                  {/* Speaker Image - Takes up exactly 2/5 of card width */}
                  <div className="relative w-2/5 flex-shrink-0">
                    <img 
                      src="/assets/prof-andy-hsu.jpg" 
                      alt="Prof Andy Hsu" 
                      className="w-full h-full object-cover"
                      style={{
                        maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
                      }}
                    />
                  </div>
                  
                  {/* Speaker Content - Takes up 3/5 of card width */}
                  <div className="flex-1 p-8 flex flex-col justify-center relative">
                    {/* Content background for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-r-3xl"></div>
                    
                    <div className="relative z-10">
                      <p className="text-white font-nunito text-base leading-relaxed mb-6 font-medium">
                      An internationally recognised Australian clinical neuroscientist and educator.
                      </p>
                      
                      <div className="text-white">
                        <p className="font-playfair font-bold text-xl mb-2">Prof Andy Hsu</p>
                        <p className="text-amberGlow font-nunito text-sm font-semibold tracking-wide">Neuroscientist, Australia</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Speaker Card 2 - Dr Diana Chan */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500 hover:transform hover:scale-[1.02] shadow-2xl"
              >
                <div className="flex h-64">
                  {/* Speaker Image - Takes up exactly 2/5 of card width */}
                  <div className="relative w-2/5 flex-shrink-0">
                    <div 
                      className="w-full h-full bg-gray-700 flex items-center justify-center"
                      style={{
                        maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
                      }}
                    >
                      <div className="text-white/50 text-center">
                      <img 
                        src="/assets/dr-diana-chan.jpg" 
                        alt="Dr Diana Chan" 
                        className="w-full h-full object-cover"
                      />
                        <p className="text-sm font-nunito">Dr Diana Chan</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speaker Content - Takes up 3/5 of card width */}
                  <div className="flex-1 p-8 flex flex-col justify-center relative">
                    {/* Content background for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-r-3xl"></div>
                    
                    <div className="relative z-10">
                      <p className="text-white font-nunito text-base leading-relaxed mb-6 font-medium">
                      A specialist in pain management, anaesthesiology and Past Head of Department of Pain Medicine in Singapore General Hospital
                      </p>
                      
                      <div className="text-white">
                        <p className="font-playfair font-bold text-xl mb-2">Dr Diana Chan</p>
                        <p className="text-amberGlow font-nunito text-sm font-semibold tracking-wide">Pain Management Specialist, Singapore</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Section 4: What You'll Discover */}
      <section id="learn" className="relative min-h-screen flex items-center">
        {/* Mirror Background Image - Vertically Flipped from About Section */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/about-background-placeholder.jpg')`,
              backgroundColor: '#1e293b',
              transform: 'scaleY(-1)' // Mirror vertically
            }}
          />
          <img 
            src="/assets/about-background-placeholder.jpg"
            alt=""
            className="hidden"
            onError={(e) => {
              const target = e.currentTarget;
              const parent = target.parentElement?.parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
          {/* Image Placeholder when image is not found */}
          <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-slate-800" style={{ display: 'none' }}>
            <div className="text-white/50 text-center">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg font-nunito">Same as about section (mirrored)</p>
              <p className="text-sm font-nunito text-white/30 mt-2">about-background-placeholder.jpg</p>
            </div>
          </div>
        </div>

        {/* Base dark overlay - Same as about section */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Mirror Gradient Overlay - Vertically Flipped from About Section */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to right, rgba(42, 114, 196, 0.7) 0%, rgba(42, 114, 196, 0.4) 50%, rgba(253, 186, 116, 0.7) 100%)
          `,
          transform: 'scaleY(-1)' // Mirror the gradient vertically
        }}></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold mb-6 leading-tight drop-shadow-lg">
              What You&apos;ll <span className="text-amberGlow">Discover</span>
            </h2>
            <p className="text-lg font-nunito text-white/80 max-w-3xl mx-auto leading-relaxed">
              Transformative insights that will change how you think about pain management
            </p>
          </motion.div>

          {/* Interactive Layout - Titles on Left (Small), Cards Take Most Space */}
          <div className="grid lg:grid-cols-[1fr_3fr] gap-4 lg:gap-6 items-start">
            {/* Left Side - Elegant Title List */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-0"
            >
              {[
                "Brain-Body Reset",
                "Pain Without Pills", 
                "Instant Relief Techniques"
              ].map((title, index) => (
                <div key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="cursor-pointer group py-8"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <motion.h3 
                      className="text-2xl lg:text-3xl font-playfair font-bold text-white/80 group-hover:text-amberGlow transition-all duration-500 leading-tight"
                      whileHover={{ x: 20 }}
                    >
                      {title}
                    </motion.h3>
                  </motion.div>
                  {/* Elegant Divider Line */}
                  {index < 2 && (
                    <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent"></div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Right Side - Interactive Cards (3/4 of section) - MUCH WIDER */}
            <div className="grid md:grid-cols-3 gap-3 lg:gap-4">
              {[
                {
                  image: "/assets/discover-card-1.jpg",
                  title: "Brain-Body Reset",
                  description: "Understand the neural pathways of pain and how to rewire them naturally through cutting-edge neuroscience research"
                },
                {
                  image: "/assets/discover-card-2.jpg", 
                  title: "Pain Without Pills",
                  description: "Evidence-based alternatives to pharmaceutical interventions that provide lasting relief without dependency"
                },
                {
                  image: "/assets/discover-card-3.jpg",
                  title: "Instant Relief Techniques", 
                  description: "Practical methods you can apply immediately for pain management in your daily life"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  animate={{
                    y: hoveredCard === index ? -10 : 0,
                    scale: hoveredCard === index ? 1.02 : 1,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                {/* Luxury Glass Card - Slightly Rounded Edges */}
                <div 
                  className="relative bg-white/5 backdrop-blur-2xl overflow-hidden transition-all duration-500 h-[400px] rounded-lg flex flex-col"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    boxShadow: hoveredCard === index ? '0 25px 50px -12px rgba(0,0,0,0.8)' : 'none',
                    backgroundColor: hoveredCard === index ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Card Image - 2/2.4 ratio */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.outerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-primary/30 to-amberGlow/30 flex items-center justify-center">
                            <div class="text-white/50 text-center">
                              <div class="text-4xl mb-2">📖</div>
                              <p class="text-sm font-nunito">${item.title}</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                    {/* Image Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {/* Stronger Blurred Edge Effect - Like About Section Cards */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        maskImage: 'linear-gradient(to top, black 60%, transparent 80%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 80%)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent"></div>
                    </div>
                    {/* Additional Fade for Smoother Edge */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-white/8 via-transparent to-transparent"
                      style={{
                        maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)'
                      }}
                    ></div>
                  </div>

                  {/* Card Content - Explicit Height and Centering */}
                  <div 
                    className="relative flex items-center justify-center px-6"
                    style={{ height: '144px' }}
                  >
                    <p className="font-nunito text-white/70 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-500 text-center max-w-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Luxury Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amberGlow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Event Countdown - Reduced Height */}
      <section id="register" className="relative py-16 min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/assets/registration-background-placeholder.jpg')`,
              backgroundColor: '#e5e7eb'
            }}
          />
          <img 
            src="/assets/registration-background-placeholder.jpg"
            alt=""
            className="hidden"
            onError={(e) => {
              const target = e.currentTarget;
              const parent = target.parentElement?.parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
          {/* Image Placeholder */}
          <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-200" style={{ display: 'none' }}>
            <div className="text-gray-500 text-center">
              <div className="text-6xl mb-4">🎟️</div>
              <p className="text-lg font-nunito">Replace registration-background-placeholder.jpg</p>
              <p className="text-sm font-nunito text-gray-400 mt-2">in /public/assets/ folder</p>
            </div>
          </div>
        </div>

        {/* Base dark overlay - Same as discover section */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Mirror Gradient Overlay - Top 2/5 Only with Fading Effect */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to right, rgba(42, 114, 196, 0.7) 0%, rgba(42, 114, 196, 0.4) 50%, rgba(253, 186, 116, 0.7) 100%)
          `,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 65%, transparent 100%)'
        }}></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          {/* Call to Action Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold mb-6 leading-tight drop-shadow-lg">
              Hesitate No More...
            </h2>
            <p className="text-lg font-nunito text-white/80 max-w-3xl mx-auto leading-relaxed">
              Reserve your spot for this exclusive seminar.
            </p>
          </motion.div>

          {/* Live Countdown Timer */}
          <CountdownTimer />

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12 text-white/90"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <span className="font-nunito font-medium text-lg">7 September 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
              </svg>
              <span className="font-nunito font-medium text-lg">3:00 PM SGT</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.94L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.94C18.78,16.56 20,17.71 20,19Z"/>
              </svg>
              <span className="font-nunito font-medium text-lg">West Forum, Trehaus @ Funan, City Hall</span>
            </div>
          </motion.div>

          {/* Reserve Spot Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRegistration(true)}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-nunito font-medium hover:bg-white/30 transition-all duration-300"
            >
              JOIN NOW!
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(253, 186, 116, 0.3) 0%, transparent 50%)`
          }}></div>
            </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content - Left/Right Grid Layout */}
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start mb-12">
            
            {/* Left Grid (1/3) - Logo & Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              {/* Logo */}
              <div className="mb-0">
                <img
                  src="/assets/dexabrain-logo.png"
                  alt="Dexabrain"
                  className="h-40 mx-auto lg:mx-0"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'block';
                  }}
                />
                <div className="hidden bg-primary/20 px-6 py-3 rounded-lg border border-primary/30">
                  <span className="text-2xl font-playfair font-bold text-white">DEXABRAIN</span>
                </div>
              </div>
              
              {/* Tagline */}
              <p className="text-white/80 font-nunito text-base leading-relaxed">
                Transforming neuroscience education and pain management through innovative healthcare solutions.
              </p>
            </motion.div>

            {/* Right Grid (2/3) - Newsletter, Social, etc. */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              
              {/* Newsletter Signup */}
              <div className="text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-playfair font-bold text-white mb-3">
                  Stay Connected
                </h3>
                <p className="text-white/80 font-nunito text-md mb-6 leading-relaxed">
                  Sign up for our newsletter and stay up-to-date on the latest event trends, 
                  industry news, and exclusive Dexa Brain promotions.
                </p>
                
                {/* Email Subscription Form */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                  <input
                    type="email"
                    placeholder="Write Your Email"
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-nunito text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-white text-slate-900 font-nunito font-semibold rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg text-sm"
                  >
                    SUBSCRIBE
                  </motion.button>
              </div>
            </div>
            
              {/* Social Media Links */}
              <div className="flex justify-center lg:justify-start items-center gap-4">
                {/* Facebook */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>

                {/* Twitter */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>
          
          {/* Footer Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10 text-center"
          >
            <p className="text-white/60 font-nunito text-sm">
              © 2025 Dexabrain. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>

      {/* BACKUP: Original Registration Form Code (Hidden - for future modal) */}
      <div style={{ display: 'none' }}>
        {/* Registration form backup for future modal implementation */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-nunito font-medium mb-2">
                  Full Name *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-amberGlow focus:outline-none focus:ring-2 focus:ring-amberGlow/20 transition-all font-nunito"
                  placeholder="Enter your full name"
                />
              </div>
            <div>
                <label className="block text-white font-nunito font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-amberGlow focus:outline-none focus:ring-2 focus:ring-amberGlow/20 transition-all font-nunito"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-nunito font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-amberGlow focus:outline-none focus:ring-2 focus:ring-amberGlow/20 transition-all font-nunito"
                  placeholder="+65 1234 5678"
                />
              </div>
            <div>
                <label className="block text-white font-nunito font-medium mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-amberGlow focus:outline-none focus:ring-2 focus:ring-amberGlow/20 transition-all font-nunito"
                  placeholder="Enter referral code"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-amberGlow text-white font-nunito font-bold py-4 px-8 rounded-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Reserve My Spot
            </button>
          </form>
            </div>
          </div>
          

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSubmit={handleRegistrationSubmit}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        registrantName={registrantName}
      />
    </div>
  );
} 