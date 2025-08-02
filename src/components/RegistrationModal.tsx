'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';

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

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationData) => void;
}

export default function RegistrationModal({ isOpen, onClose, onSubmit }: RegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<RegistrationData>({
    defaultValues: {
      numberOfPax: 1,
      primaryAttendee: { name: '', email: '', phone: '' },
      additionalAttendees: [],
      referralCode: '',
      consentGiven: false
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalAttendees'
  });

  const addAttendee = () => {
    append({ name: '', email: '', phone: '' });
  };

  const removeAttendee = (index: number) => {
    remove(index);
  };

  const handleFormSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // Update numberOfPax based on actual attendees
      data.numberOfPax = 1 + data.additionalAttendees.length;
      
      // Submit to API
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // Call parent onSubmit with the result data
        onSubmit(data);
        reset();
        onClose();
      } else {
        // Handle error - you might want to show an error message
        console.error('Registration failed:', result.message);
        alert('Registration failed: ' + result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="registration-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full h-full bg-white/10 backdrop-blur-xl border-l border-black shadow-2xl overflow-y-auto lg:overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="/assets/r-modal-background.jpg" 
                alt="Registration Modal Background" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800" style={{ display: 'none' }}>
                <div className="text-slate-400 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-lg font-nunito">Background placeholder</p>
                </div>
              </div>
            </div>

            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black/40 to-amberGlow/30"></div>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseClick}
              disabled={isSubmitting}
              className={`absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-black border border-black backdrop-blur-sm ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Fullscreen Grid Layout - Mobile Stack, Desktop Side-by-Side */}
            <div className="relative z-10 min-h-full lg:h-full flex flex-col lg:grid lg:grid-cols-[3fr_2fr]">
              
              {/* Left Section - Registration Form - Above right section on mobile */}
              <div className="min-h-screen lg:min-h-0 lg:h-full lg:overflow-y-auto relative">
                {/* White overlay for mobile to prevent dark background bleeding through */}
                <div className="absolute inset-0 bg-white/60 lg:bg-transparent"></div>
                <div className="relative z-10 p-3 sm:p-4 lg:p-5 xl:p-6 min-h-screen lg:min-h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-4 sm:mb-5">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold text-black mb-1 sm:mb-2"
                    >
                      Reserve Your Spot
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-black font-nunito text-sm sm:text-base mb-3 sm:mb-4"
                    >
                      Join us for this exclusive Neuro Reset Awareness Seminar
                    </motion.p>
                  </div>

                {/* Registration Form */}
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4 sm:space-y-6 lg:space-y-8 flex-1"
                >

                                     {/* Primary Attendee Details */}
                   <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-black relative">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                       <h3 className="text-lg sm:text-xl font-playfair font-bold text-slate-800">
                         Primary Attendee Details
                       </h3>
                       {/* Add Another Attendee Button - Moved to upper right */}
                       <button
                         type="button"
                         onClick={addAttendee}
                         className="flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 text-black hover:bg-amberGlow/10 transition-all duration-300 font-nunito text-xs sm:text-sm font-medium rounded-lg"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                         Add Attendee
                       </button>
                     </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                          Full Name *
                        </label>
                        <input
                          {...register('primaryAttendee.name', { required: 'Full name is required' })}
                          className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                          placeholder="Enter full name"
                        />
                        {errors.primaryAttendee?.name && (
                          <p className="text-red-500 text-sm mt-2 font-nunito">{errors.primaryAttendee.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('primaryAttendee.email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                          placeholder="Enter email address"
                        />
                        {errors.primaryAttendee?.email && (
                          <p className="text-red-500 text-sm mt-2 font-nunito">{errors.primaryAttendee.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register('primaryAttendee.phone', { required: 'Phone number is required' })}
                          className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                          placeholder="+65 1234 5678"
                        />
                        {errors.primaryAttendee?.phone && (
                          <p className="text-red-500 text-sm mt-2 font-nunito">{errors.primaryAttendee.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                          Referral Code (Optional)
                        </label>
                        <input
                          {...register('referralCode')}
                          className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                          placeholder="Enter referral code"
                        />
                      </div>
                    </div>
                                     </div>

                  {/* Additional Attendees */}
                  <AnimatePresence>
                    {fields.length > 0 && (
                      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-black relative"
                          >
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeAttendee(index)}
                              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-600 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            
                            <h3 className="text-lg sm:text-xl font-playfair font-bold text-slate-800 mb-3 sm:mb-4">
                              Attendee {index + 2} Details
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                                  Full Name *
                                </label>
                                <input
                                  {...register(`additionalAttendees.${index}.name`, { required: 'Name is required' })}
                                  className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                                  placeholder="Enter full name"
                                />
                                {errors.additionalAttendees?.[index]?.name && (
                                  <p className="text-red-500 text-sm mt-2 font-nunito">{errors.additionalAttendees[index]?.name?.message}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                                  Email Address *
                                </label>
                                <input
                                  type="email"
                                  {...register(`additionalAttendees.${index}.email`, { 
                                    required: 'Email is required',
                                    pattern: {
                                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                      message: 'Invalid email address'
                                    }
                                  })}
                                  className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                                  placeholder="Enter email address"
                                />
                                {errors.additionalAttendees?.[index]?.email && (
                                  <p className="text-red-500 text-sm mt-2 font-nunito">{errors.additionalAttendees[index]?.email?.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-3 sm:mt-4">
                              <div>
                                <label className="block text-black font-nunito font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                                  Phone Number *
                                </label>
                                <input
                                  type="tel"
                                  {...register(`additionalAttendees.${index}.phone`, { required: 'Phone number is required' })}
                                  className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-sm sm:text-base"
                                  placeholder="+65 1234 5678"
                                />
                                {errors.additionalAttendees?.[index]?.phone && (
                                  <p className="text-red-500 text-sm mt-2 font-nunito">{errors.additionalAttendees[index]?.phone?.message}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Consent Checkbox - Singapore PDPA Compliant */}
                  <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-black">
                    <label className="flex items-start gap-2 sm:gap-3 lg:gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('consentGiven', { required: 'You must provide consent to proceed' })}
                        className="mt-1 w-4 h-4 text-amberGlow bg-white/20 border-black rounded focus:ring-amberGlow focus:ring-2"
                      />
                      <div className="text-black font-nunito text-xs sm:text-sm leading-relaxed">
                        <p className="mb-1 sm:mb-2">
                          <strong className="text-black text-sm sm:text-base">Privacy & Data Consent</strong>
                        </p>
                        <p className="mb-1 sm:mb-2">
                          I consent to Dexabrain collecting and using my personal data for event registration, communication, and service improvement purposes. 
                          I may withdraw consent anytime, subject to legal requirements.
                        </p>
                        <p className="text-black text-xs">
                          In accordance with Singapore&apos;s Personal Data Protection Act 2012. 
                          <span className="text-amberGlow hover:text-amberGlow/80 cursor-pointer underline ml-1">
                            View Privacy Policy
                          </span>
                        </p>
                      </div>
                    </label>
                    {errors.consentGiven && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 font-nunito ml-6 sm:ml-8 lg:ml-9">{errors.consentGiven.message}</p>
                    )}
                  </div>

                  {/* Submit Button - Match Event Page Design */}
                  <div className="pt-4 sm:pt-5 lg:pt-6 flex justify-center">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ 
                        scale: isSubmitting ? 1 : 1.05,
                        boxShadow: isSubmitting ? "none" : "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                      }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      className={`bg-white/20 backdrop-blur-sm border border-black text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-nunito font-medium transition-all duration-300 text-sm sm:text-base ${
                        isSubmitting 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-white/30'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          PROCESSING...
                        </div>
                      ) : (
                        'SIGN UP'
                      )}
                    </motion.button>
                  </div>
                </motion.form>
                </div>
              </div>

              {/* Right Section - Contact Details & Mobile Event Info - Below form on mobile */}
              <div className="lg:h-full border-t lg:border-t-0 lg:border-l border-black relative">
                {/* White overlay for mobile to prevent dark background bleeding through */}
                <div className="absolute inset-0 bg-white/60 lg:bg-transparent"></div>
                {/* Consistent background layer */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
                <div className="relative z-10 p-4 sm:p-6 lg:p-8 lg:h-full flex flex-col lg:min-h-0">
                  
                  {/* Top Section - Event Information and Contact Organiser Side by Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 sm:mb-6 lg:mb-8"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      {/* Event Information */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-playfair font-bold text-slate-800 mb-3 sm:mb-4">
                          Event Information
                        </h3>
                        
                        {/* Event Date & Time */}
                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-black">
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800 text-sm sm:text-base">7 September 2025</p>
                              <p className="text-xs sm:text-sm text-black">Sunday</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800 text-sm sm:text-base">3:00 PM - 6:00 PM</p>
                              <p className="text-xs sm:text-sm text-black">Singapore Time (SGT)</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.94L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.94C18.78,16.56 20,17.71 20,19Z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800 text-sm sm:text-base">West Forum</p>
                              <p className="text-xs sm:text-sm text-black leading-relaxed">
                                Trehaus @ Funan #07-21<br />
                                109 North Bridge Road<br />
                                Singapore 179097
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* FREE Badge */}
                        <div className="inline-flex items-center gap-2 bg-amberGlow/20 px-4 py-2 rounded-full border border-black">
                          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                          </svg>
                          <span className="text-black font-nunito font-semibold text-sm">FREE ADMISSION</span>
                        </div>
                      </div>

                      {/* Contact Organiser */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-playfair font-bold text-slate-800 mb-3 sm:mb-4">
                          Contact Organiser
                        </h3>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800 text-sm sm:text-base">info@dexabrain.com</p>
                              <p className="text-black text-xs sm:text-sm">General Inquiries</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800 text-sm sm:text-base">+65 1234 5678</p>
                              <p className="text-black text-xs sm:text-sm">Event Support</p>
                            </div>
                          </div>
                          
                          {/* <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                            </svg> */}
                            {/* <div>
                              <p className="font-nunito font-medium text-slate-800">www.dexabrain.com</p>
                              <p className="text-black text-sm">Visit Our Website</p>
                            </div> */}
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Map Section - Optimized Size */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="hidden lg:block lg:flex-1 lg:min-h-2"
                  >
                    <h4 className="text-base sm:text-lg font-playfair font-bold text-black mb-4 sm:mb-6">Location</h4>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden h-48 sm:h-64">
                      {/* Google Maps Embed */}
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8151862071846!2d103.85179731475431!3d1.2896700990643946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da190d593a26ad%3A0xc7d4e82b65d00750!2s109%20North%20Bridge%20Rd%2C%20Singapore%20179097!5e0!3m2!1sen!2ssg!4v1625760000000!5m2!1sen!2ssg"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-xl"
                      ></iframe>
                
                      
                      {/* View in Google Maps button */}
                      <div className="absolute bottom-3 right-3">
                        <a
                          href="https://www.google.com/maps/place/109+North+Bridge+Rd,+Singapore+179097/@1.2896701,103.8517973,17z/data=!3m1!4b1!4m6!3m5!1s0x31da190d593a26ad:0xc7d4e82b65d00750!8m2!3d1.2896701!4d103.8543722!16s%2Fg%2F11c5p7qx1y"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-800/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-white font-nunito font-medium hover:bg-slate-700 transition-colors border border-black text-xs flex items-center gap-1 sm:gap-1.5"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in Maps
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading Modal Overlay */}
      {isSubmitting && (
        <motion.div
          key="loading-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 max-w-sm mx-4 text-center shadow-2xl border border-white/20"
          >
            {/* Loading Animation */}
            <div className="mb-6">
              {/* Loading Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <svg className="w-16 h-16 text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/10 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <h3 className="text-xl font-playfair font-bold text-slate-800">
                Processing Registration
              </h3>
              <p className="text-slate-600 font-nunito text-sm">
                Please wait while we register your details...
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}