export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  referralCode?: string;
}

export const generateConfirmationEmail = (data: RegistrationData) => {
  return {
    to: data.email,
    subject: 'Registration Confirmed - Neuro Reset Awareness Seminar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A72C4;">Registration Confirmed!</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for registering for the <strong>Neuro Reset Awareness Seminar</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Event Details:</h3>
          <p><strong>Date:</strong> September 7, 2025</p>
          <p><strong>Time:</strong> 3:00 PM - 4:30 PM</p>
          <p><strong>Venue:</strong> West Forum, Trehaus, Funan L3, City Hall</p>
          <p><strong>Speakers:</strong> Prof Andy Hsu & Dr Diana Chan</p>
        </div>
        
        <p>We look forward to seeing you at the seminar!</p>
        
        <p>Best regards,<br>The Dexabrain Team</p>
      </div>
    `
  };
};

export const sendConfirmationEmail = async (data: RegistrationData): Promise<boolean> => {
  try {
    // Mock implementation - in production, this would call your Google Apps Script
    console.log('Sending confirmation email to:', data.email);
    console.log('Email content:', generateConfirmationEmail(data));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}; 