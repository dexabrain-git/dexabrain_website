'use client';

import { useState, useEffect } from 'react';
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

  const handleFormSubmit = (data: RegistrationData) => {
    // Update numberOfPax based on actual attendees
    data.numberOfPax = 1 + data.additionalAttendees.length;
    onSubmit(data);
    reset();
    onClose();
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
    <AnimatePresence>primary
      {isOpen && (
        <motion.div
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
            className="relative w-full h-full bg-white/10 backdrop-blur-xl border-l border-black shadow-2xl overflow-hidden"
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
              className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-black border border-black backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Fullscreen Grid Layout */}
            <div className="relative z-10 h-full grid lg:grid-cols-[3fr_2fr]">
              
              {/* Left Section - Registration Form (3/5) */}
              <div className="h-full overflow-y-auto">
                <div className="p-4 sm:p-5 lg:p-6 min-h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-5">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl lg:text-3xl font-playfair font-bold text-black mb-2"
                    >
                      Reserve Your Spot
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-black font-nunito text-base mb-4"
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
                  className="space-y-8 flex-1"
                >

                                     {/* Primary Attendee Details */}
                   <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-black relative">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xl font-playfair font-bold text-slate-800">
                         Primary Attendee Details
                       </h3>
                       {/* Add Another Attendee Button - Moved to upper right */}
                       <button
                         type="button"
                         onClick={addAttendee}
                         className="flex items-center gap-2 px-3 py-1.5 text-amberGlow hover:bg-amberGlow/10 transition-all duration-300 font-nunito text-sm font-medium rounded-lg"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                         Add Attendee
                       </button>
                     </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-black font-nunito font-medium mb-2 text-sm">
                          Full Name *
                        </label>
                        <input
                          {...register('primaryAttendee.name', { required: 'Full name is required' })}
                          className="w-full px-3 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
                          placeholder="Enter full name"
                        />
                        {errors.primaryAttendee?.name && (
                          <p className="text-red-500 text-sm mt-2 font-nunito">{errors.primaryAttendee.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-black font-nunito font-medium mb-2 text-sm">
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
                          className="w-full px-3 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
                          placeholder="Enter email address"
                        />
                        {errors.primaryAttendee?.email && (
                          <p className="text-red-500 text-sm mt-2 font-nunito">{errors.primaryAttendee.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-black font-nunito font-medium mb-2 text-sm">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register('primaryAttendee.phone', { required: 'Phone number is required' })}
                          className="w-full px-3 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
                          placeholder="+65 1234 5678"
                        />
                        {errors.primaryAttendee?.phone && (
                          <p className="text-red-500 text-sm mt-2 font-nunito">{errors.primaryAttendee.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-black font-nunito font-medium mb-2 text-sm">
                          Referral Code (Optional)
                        </label>
                        <input
                          {...register('referralCode')}
                          className="w-full px-3 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
                          placeholder="Enter referral code"
                        />
                      </div>
                    </div>
                                     </div>

                  {/* Additional Attendees */}
                  <AnimatePresence>
                    {fields.length > 0 && (
                      <div className="space-y-5">
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-black relative"
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
                            
                            <h3 className="text-xl font-playfair font-bold text-slate-800 mb-4">
                              Attendee {index + 2} Details
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-black font-nunito font-medium mb-2 text-sm">
                                  Full Name *
                                </label>
                                <input
                                  {...register(`additionalAttendees.${index}.name`, { required: 'Name is required' })}
                                  className="w-full px-3 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
                                  placeholder="Enter full name"
                                />
                                {errors.additionalAttendees?.[index]?.name && (
                                  <p className="text-red-500 text-sm mt-2 font-nunito">{errors.additionalAttendees[index]?.name?.message}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-black font-nunito font-medium mb-2 text-sm">
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
                                  className="w-full px-3 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
                                  placeholder="Enter email address"
                                />
                                {errors.additionalAttendees?.[index]?.email && (
                                  <p className="text-red-500 text-sm mt-2 font-nunito">{errors.additionalAttendees[index]?.email?.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-1 gap-4 mt-4">
                              <div>
                                <label className="block text-black font-nunito font-medium mb-2 text-sm">
                                  Phone Number *
                                </label>
                                <input
                                  type="tel"
                                  {...register(`additionalAttendees.${index}.phone`, { required: 'Phone number is required' })}
                                  className="w-full px-3 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-black text-black placeholder-slate-500 focus:border-amberGlow focus:outline-none focus:ring-1 focus:ring-primary transition-all font-nunito text-base"
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
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-black">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('consentGiven', { required: 'You must provide consent to proceed' })}
                        className="mt-1 w-4 h-4 text-amberGlow bg-white/20 border-black rounded focus:ring-amberGlow focus:ring-2"
                      />
                      <div className="text-black font-nunito text-sm leading-relaxed">
                        <p className="mb-2">
                          <strong className="text-black text-base">Privacy & Data Consent</strong>
                        </p>
                        <p className="mb-2">
                          I consent to Dexabrain collecting and using my personal data for event registration, communication, and service improvement purposes. 
                          I may withdraw consent anytime, subject to legal requirements.
                        </p>
                        <p className="text-black text-xs">
                          In accordance with Singapore's Personal Data Protection Act 2012. 
                          <span className="text-amberGlow hover:text-amberGlow/80 cursor-pointer underline ml-1">
                            View Privacy Policy
                          </span>
                        </p>
                      </div>
                    </label>
                    {errors.consentGiven && (
                      <p className="text-red-500 text-sm mt-2 font-nunito ml-9">{errors.consentGiven.message}</p>
                    )}
                  </div>

                  {/* Submit Button - Match Event Page Design */}
                  <div className="pt-6 flex justify-center">
                    <motion.button
                      type="submit"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/20 backdrop-blur-sm border border-black text-black px-8 py-3 rounded-full font-nunito font-medium hover:bg-white/30 transition-all duration-300"
                    >
                      SIGN UP
                    </motion.button>
                  </div>
                </motion.form>
                </div>
              </div>

              {/* Right Section - Contact Details & Map (2/5) */}
              <div className="hidden lg:block h-full bg-white/10 backdrop-blur-md border-l border-black">
                <div className="p-8 h-full flex flex-col">
                  
                  {/* Top Section - Event Information and Contact Organiser Side by Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {/* Event Information */}
                      <div>
                        <h3 className="text-xl font-playfair font-bold text-slate-800 mb-4">
                          Event Information
                        </h3>
                        
                        {/* Event Date & Time */}
                        <div className="space-y-4 mb-6 text-black">
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800">7 September 2025</p>
                              <p className="text-sm text-black">Sunday</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800">3:00 PM - 6:00 PM</p>
                              <p className="text-sm text-black">Singapore Time (SGT)</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.94L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.94C18.78,16.56 20,17.71 20,19Z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800">West Forum</p>
                              <p className="text-sm text-black leading-relaxed">
                                Trehaus @ Funan<br />
                                109 North Bridge Road<br />
                                Singapore 179097
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* FREE Badge */}
                        <div className="inline-flex items-center gap-2 bg-amberGlow/20 px-4 py-2 rounded-full border border-amberGlow/40">
                          <svg className="w-4 h-4 text-amberGlow" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                          </svg>
                          <span className="text-amberGlow font-nunito font-semibold text-sm">FREE ADMISSION</span>
                        </div>
                      </div>

                      {/* Contact Organiser */}
                      <div>
                        <h3 className="text-xl font-playfair font-bold text-slate-800 mb-4">
                          Contact Organiser
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800">info@dexabrain.com</p>
                              <p className="text-black text-sm">General Inquiries</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            <div>
                              <p className="font-nunito font-medium text-slate-800">+65 1234 5678</p>
                              <p className="text-black text-sm">Event Support</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-700">
                            <svg className="w-5 h-5 text-amberGlow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                            </svg>
                            {/* <div>
                              <p className="font-nunito font-medium text-slate-800">www.dexabrain.com</p>
                              <p className="text-black text-sm">Visit Our Website</p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Map Section - Optimized Size */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex-1 min-h-2"
                  >
                    <h4 className="text-lg font-playfair font-bold text-black mb-6">Location</h4>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden h-64">
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
                          className="bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white font-nunito font-medium hover:bg-slate-700 transition-colors border border-black text-xs flex items-center gap-1.5"
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
    </AnimatePresence>
  );
}