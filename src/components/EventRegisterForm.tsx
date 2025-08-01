'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegistrationData, sendConfirmationEmail } from '@/utils/emailConfirmation';

interface EventRegisterFormProps {
  onRegistrationSuccess: (data: RegistrationData) => void;
}

export default function EventRegisterForm({ onRegistrationSuccess }: EventRegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationData>();

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Mock API call to Google Apps Script
      console.log('Submitting registration data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send confirmation email
      const emailSent = await sendConfirmationEmail(data);
      
      if (emailSent) {
        onRegistrationSuccess(data);
        reset();
      } else {
        setSubmitError('Failed to send confirmation email. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-8 max-w-md w-full border border-gray-100">
      <h3 className="text-2xl font-bold text-dark mb-6 text-center uppercase tracking-wide">
        Reserve Your Spot
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { 
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="referralCode" className="block text-sm font-medium text-dark mb-2">
            Referral Code (Optional)
          </label>
          <input
            type="text"
            id="referralCode"
            {...register('referralCode')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="Enter referral code if you have one"
          />
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-full font-bold text-white transition-all duration-300 transform hover:-translate-y-1 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-primary hover:shadow-glow'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              REGISTERING...
            </div>
          ) : (
            'REGISTER NOW'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By registering, you agree to receive updates about this event and future Dexabrain events.
        </p>
      </form>
    </div>
  );
} 