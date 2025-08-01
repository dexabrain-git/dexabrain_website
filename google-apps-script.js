/**
 * Google Apps Script for Dexabrain Event Registration
 * Deploy as Web App with "Anyone" access
 */

// Configuration
const SPREADSHEET_ID = '1el3e1rNl9UnOAoarEaaWJjsyxc9_s2UDaG00RUTsYaE'; // Replace with your sheet ID
const REGISTRATION_SHEET = 'Event_Registrations';
const NEWSLETTER_SHEET = 'Newsletter_Subscriptions';

// Email Configuration
const GMAIL_ADDRESS = 'dexabrain@gmail.com'; // Replace with your actual Gmail address
const FROM_NAME = 'Dexabrain Team';
const REPLY_TO_EMAIL = 'info@dexabrain.com'; // The email you want replies to go to

// Notification Configuration
const NOTIFICATION_EMAIL = 'dexabrain@gmail.com'; // Email to receive registration notifications

// Email Assets - Update these with your Google Drive direct image URLs
 const EMAIL_ASSETS = {
    logo: 'https://drive.google.com/uc?export=view&id=12xPMq9xAvrY76aUusFfAFXu3mb9PySqT',
    backgroundImage: 'https://drive.google.com/uc?export=view&id=1veapzT2FFhALMCxJGFLL3NSW8oCiBAjs',
    bannerImage: 'https://drive.google.com/uc?export=view&id=1gHLWQI-fNeOO-k5pPqSB_EMz9Til6CqN/view?usp=sharing',
    venueImage: 'https://drive.google.com/uc?export=view&id=1Bl126GM2RhXQiGi-NaySuE2ooygz-QAb',
    medicalBgImage: 'https://drive.google.com/uc?export=view&id=1DrJm6STVQTTxJ3x1bgRiPQ7NA3tyYOqY/view?usp=sharing'
  };

const EVENT_DETAILS = {
  name: 'Neuro Reset Awareness Seminar',
  date: 'September 7, 2025',
  time: '3:00 PM - 4:30 PM (SGT)',
  location: 'West Forum, Trehaus @ Funan #07-21',
  address: '109 North Bridge Road, Singapore 179097'
};

function doPost(e) {
  console.log(`\n🌟 [doPost] New request received`);
  console.log(`🌟 [doPost] Request method: ${e?.method || 'POST'}`);
  console.log(`🌟 [doPost] Content type: ${e?.contentType}`);
  console.log(`🌟 [doPost] Raw payload: ${e?.postData?.contents}`);
  
  try {
    if (!e?.postData?.contents) {
      console.log(`🌟 [doPost] No request data received`);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No request data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    console.log(`🌟 [doPost] Parsed action: ${action}`);
    
    if (action === 'register') {
      console.log(`🌟 [doPost] Routing to handleRegistration`);
      return handleRegistration(data);
    } else if (action === 'newsletter') {
      console.log(`🌟 [doPost] Routing to handleNewsletter`);
      return handleNewsletter(data);
    }
    
    console.log(`🌟 [doPost] Invalid action received: ${action}`);
    return createResponse(false, 'Invalid action');
    
  } catch (error) {
    console.error('🚨 [doPost] Error occurred:', error);
    console.error('🚨 [doPost] Error details:', error.toString());
    console.error('🚨 [doPost] Error stack:', error.stack);
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

function handleRegistration(data) {
  console.log(`\n🚀 [handleRegistration] Starting registration process`);
  console.log(`🚀 [handleRegistration] Input data:`, JSON.stringify(data, null, 2));
  
  try {
    console.log(`🚀 [handleRegistration] Opening spreadsheet with ID: ${SPREADSHEET_ID}`);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log(`🚀 [handleRegistration] Getting sheet: ${REGISTRATION_SHEET}`);
    let sheet = spreadsheet.getSheetByName(REGISTRATION_SHEET);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(REGISTRATION_SHEET);
      // Add headers
      sheet.getRange(1, 1, 1, 11).setValues([[
        'Timestamp', 'Registration ID', 'Attendee Type', 'Name', 'Email', 
        'Phone', 'Total in Group', 'Referral Code', 'Consent Given', 'Status', 'Confirmation Email Sent'
      ]]);
    }
    
    // Generate unique registration ID
    const registrationId = 'REG' + Date.now();
    const timestamp = new Date();
    const totalAttendees = 1 + (data.additionalAttendees?.length || 0);
    
    // Prepare rows data
    const rows = [];
    
    // Primary attendee row
    rows.push([
      timestamp,
      registrationId,
      'primary',
      data.primaryAttendee.name,
      data.primaryAttendee.email,
      data.primaryAttendee.phone,
      totalAttendees,
      data.referralCode || '',
      data.consentGiven || false,
      'confirmed',
      '' // Email sent status - will be updated later
    ]);
    
    // Additional attendees rows
    if (data.additionalAttendees && data.additionalAttendees.length > 0) {
      data.additionalAttendees.forEach(attendee => {
        rows.push([
          timestamp,
          registrationId,
          'additional',
          attendee.name,
          attendee.email,
          attendee.phone,
          totalAttendees,
          '', // No referral code for additional attendees
          '', // No consent for additional attendees
          'confirmed',
          '' // Email sent status - will be updated later
        ]);
      });
    }
    
    // Insert all rows at once
    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rows.length, 11).setValues(rows);
    
    // Auto-subscribe primary attendee to newsletter
    if (data.primaryAttendee.email) {
      addToNewsletter(data.primaryAttendee.email, 'registration');
    }
    
    // Send confirmation emails to all attendees
    console.log(`🎯 Starting email process for registration ${registrationId}`);
    const allAttendees = [data.primaryAttendee, ...(data.additionalAttendees || [])];
    console.log(`📧 Total attendees to email: ${allAttendees.length}`, allAttendees.map(a => a.email));
    const emailResults = [];
    
    for (let i = 0; i < allAttendees.length; i++) {
      const attendee = allAttendees[i];
      const isPrimary = attendee === data.primaryAttendee;
      console.log(`\n📨 Processing email ${i + 1}/${allAttendees.length} for: ${attendee.email} (${isPrimary ? 'PRIMARY' : 'ADDITIONAL'})`);
      
      let emailSent = false;
      try {
        console.log(`📤 Attempting to send email to: ${attendee.email}`);
        console.log(`📋 Registration details: ID=${registrationId}, Total=${totalAttendees}, IsPrimary=${isPrimary}`);
        
        sendConfirmationEmail(attendee, registrationId, totalAttendees, data.additionalAttendees || [], isPrimary);
        emailSent = true;
        console.log(`✅ Email sent successfully to: ${attendee.email}`);
      } catch (emailError) {
        console.error(`❌ Email sending failed for ${attendee.email}:`, emailError);
        console.error(`❌ Error details:`, emailError.toString());
        console.error(`❌ Error stack:`, emailError.stack);
        // Don't fail the registration if email fails
      }
      emailResults.push({ attendee, emailSent });
      console.log(`📊 Email result for ${attendee.email}: ${emailSent ? 'SUCCESS' : 'FAILED'}`);
    }
    
    console.log(`\n📈 Email summary for ${registrationId}:`);
    emailResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.attendee.email}: ${result.emailSent ? '✅ SENT' : '❌ FAILED'}`);
    });
    
    // Update email sent status for all attendees
    console.log(`\n📝 Updating email status in Google Sheets...`);
    updateEmailSentStatusForAllAttendees(sheet, registrationId, emailResults);
    console.log(`📝 Email status update completed`);
    
    // Send notification email to admin
    console.log(`\n🔔 Sending notification email to admin...`);
    try {
      sendRegistrationNotification(data, registrationId, totalAttendees);
      console.log(`✅ Admin notification sent successfully to: ${NOTIFICATION_EMAIL}`);
    } catch (notificationError) {
      console.error(`❌ Admin notification failed:`, notificationError);
      // Don't fail the registration if notification fails
    }
    
    return createResponse(true, 'Registration successful', {
      registrationId: registrationId,
      totalAttendees: totalAttendees,
      attendees: [data.primaryAttendee, ...(data.additionalAttendees || [])]
    });
    
  } catch (error) {
    console.error('Error in handleRegistration:', error);
    return createResponse(false, 'Registration failed: ' + error.toString());
  }
}

function handleNewsletter(data) {
  try {
    const result = addToNewsletter(data.email, 'newsletter_form');
    return createResponse(true, 'Newsletter subscription successful');
    
  } catch (error) {
    console.error('Error in handleNewsletter:', error);
    return createResponse(false, 'Newsletter subscription failed: ' + error.toString());
  }
}

function addToNewsletter(email, source) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(NEWSLETTER_SHEET);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(NEWSLETTER_SHEET);
    // Add headers
    sheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp', 'Email', 'Source', 'Status'
    ]]);
  }
  
  // Check if email already exists
  const data = sheet.getDataRange().getValues();
  const emailExists = data.some(row => row.length > 1 && row[1] === email);
  
  if (!emailExists) {
    // Add new subscription
    sheet.appendRow([
      new Date(),
      email,
      source,
      'active'
    ]);
  }
  
  return true;
}

function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - call this to test your setup
function testSetup() {
  const testData = {
    action: 'register',
    primaryAttendee: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+65 1234 5678'
    },
    additionalAttendees: [
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        phone: '+65 2345 6789'
      }
    ],
    referralCode: 'TEST123',
    consentGiven: true
  };
  
  const result = handleRegistration(testData);
  console.log(result.getContent());
}

// Simple email test function - call this to test email permissions only
function testEmailOnly() {
  console.log(`\n🧪 [testEmailOnly] Starting email-only test`);
  console.log(`🧪 [testEmailOnly] Email configuration check:`);
  console.log(`  - GMAIL_ADDRESS: ${GMAIL_ADDRESS}`);
  console.log(`  - FROM_NAME: ${FROM_NAME}`);
  console.log(`  - REPLY_TO_EMAIL: ${REPLY_TO_EMAIL}`);
  
  try {
    console.log(`🧪 [testEmailOnly] Testing Gmail permissions...`);
    
    // Test basic Gmail access
    const threads = GmailApp.getInboxThreads(0, 1);
    console.log(`🧪 [testEmailOnly] Gmail access OK - can read inbox`);
    
    // Test email sending
    console.log(`🧪 [testEmailOnly] Attempting to send test email...`);
    GmailApp.sendEmail(
      GMAIL_ADDRESS, // Send to yourself for testing
      '🧪 Test Email from Dexabrain Script',
      'This is a test email to verify that the Google Apps Script can send emails successfully.\n\nIf you receive this, your email configuration is working!',
      {
        htmlBody: '<p>This is a <strong>test email</strong> to verify that the Google Apps Script can send emails successfully.</p><p>If you receive this, your email configuration is working! ✅</p>',
        name: FROM_NAME,
        replyTo: REPLY_TO_EMAIL
      }
    );
    
    console.log(`✅ [testEmailOnly] Test email sent successfully to ${GMAIL_ADDRESS}`);
    console.log(`✅ [testEmailOnly] Check your inbox to confirm receipt`);
    
    return 'Email test completed successfully';
    
  } catch (error) {
    console.error(`🚨 [testEmailOnly] Email test failed:`, error);
    console.error(`🚨 [testEmailOnly] Error message:`, error.message);
    console.error(`🚨 [testEmailOnly] Error stack:`, error.stack);
    return `Email test failed: ${error.message}`;
  }
}

// Template testing function - sends sample emails with different scenarios
function testEmailTemplates() {
  console.log(`\n📧 [testEmailTemplates] Starting email template testing`);
  console.log(`📧 [testEmailTemplates] Sending to: ${GMAIL_ADDRESS}`);
  
  try {
    // Test Scenario 1: Single attendee registration
    console.log(`📧 [testEmailTemplates] Test 1: Single attendee`);
    const singleAttendee = {
      name: 'John Doe',
      email: GMAIL_ADDRESS,
      phone: '+65 1234 5678'
    };
    
    sendConfirmationEmail(
      singleAttendee,
      'REG' + Date.now() + '_TEST1',
      1,
      [],
      true
    );
    
    // Wait a moment between sends
    Utilities.sleep(2000);
    
    // Test Scenario 2: Primary attendee with additional attendees
    console.log(`📧 [testEmailTemplates] Test 2: Primary attendee with group`);
    const primaryAttendee = {
      name: 'Jane Smith',
      email: GMAIL_ADDRESS,
      phone: '+65 2345 6789'
    };
    
    const additionalAttendees = [
      { name: 'Bob Wilson', email: 'bob@example.com', phone: '+65 3456 7890' },
      { name: 'Alice Brown', email: 'alice@example.com', phone: '+65 4567 8901' }
    ];
    
    sendConfirmationEmail(
      primaryAttendee,
      'REG' + Date.now() + '_TEST2',
      3,
      additionalAttendees,
      true
    );
    
    // Wait a moment between sends
    Utilities.sleep(2000);
    
    // Test Scenario 3: Additional attendee perspective
    console.log(`📧 [testEmailTemplates] Test 3: Additional attendee view`);
    const additionalAttendee = {
      name: 'Mike Johnson',
      email: GMAIL_ADDRESS,
      phone: '+65 5678 9012'
    };
    
    sendConfirmationEmail(
      additionalAttendee,
      'REG' + Date.now() + '_TEST3',
      4,
      [], // Additional attendees don't see other attendees
      false
    );
    
    console.log(`✅ [testEmailTemplates] All template tests sent successfully!`);
    console.log(`✅ [testEmailTemplates] Check your inbox for 3 different email scenarios:`);
    console.log(`   1. Single attendee registration`);
    console.log(`   2. Primary attendee with group (shows other attendees)`);
    console.log(`   3. Additional attendee view (shows group info)`);
    
    return 'Email template tests completed successfully! Check your inbox for 3 test emails.';
    
  } catch (error) {
    console.error(`🚨 [testEmailTemplates] Template test failed:`, error);
    console.error(`🚨 [testEmailTemplates] Error message:`, error.message);
    console.error(`🚨 [testEmailTemplates] Error stack:`, error.stack);
    return `Email template test failed: ${error.message}`;
  }
}

// Quick single template test - sends one luxury email to yourself
function testSingleTemplate() {
  console.log(`\n📧 [testSingleTemplate] Sending single template test`);
  
  try {
    const testAttendee = {
      name: 'Template Tester',
      email: GMAIL_ADDRESS,
      phone: '+65 1234 5678'
    };
    
    const testAdditional = [
      { name: 'Guest One', email: 'guest1@example.com', phone: '+65 2345 6789' },
      { name: 'Guest Two', email: 'guest2@example.com', phone: '+65 3456 7890' }
    ];
    
    console.log(`📧 [testSingleTemplate] Sending luxury template to: ${GMAIL_ADDRESS}`);
    
    sendConfirmationEmail(
      testAttendee,
      'REG' + Date.now() + '_TEMPLATE_TEST',
      3,
      testAdditional,
      true
    );
    
    console.log(`✅ [testSingleTemplate] Luxury template sent successfully!`);
    console.log(`✅ [testSingleTemplate] Check your inbox to review the new design`);
    
    return 'Single template test sent! Check your inbox for the luxury design.';
    
  } catch (error) {
    console.error(`🚨 [testSingleTemplate] Single template test failed:`, error);
    console.error(`🚨 [testSingleTemplate] Error message:`, error.message);
    console.error(`🚨 [testSingleTemplate] Error stack:`, error.stack);
    return `Single template test failed: ${error.message}`;
  }
}

// Test asset URLs - helps verify your Google Drive image links work
function testAssetUrls() {
  console.log(`\n🖼️ [testAssetUrls] Testing image asset URLs`);
  console.log(`🖼️ Logo URL: ${EMAIL_ASSETS.logo}`);
  console.log(`🖼️ Background URL: ${EMAIL_ASSETS.backgroundImage}`);
  console.log(`🖼️ Banner URL: ${EMAIL_ASSETS.bannerImage}`);
  console.log(`🖼️ Venue URL: ${EMAIL_ASSETS.venueImage}`);
  console.log(`🖼️ Medical BG URL: ${EMAIL_ASSETS.medicalBgImage}`);
  
  // Check if URLs contain placeholder text
  const hasPlaceholders = Object.values(EMAIL_ASSETS).some(url => url.includes('YOUR_') || url.includes('FILE_ID'));
  
  if (hasPlaceholders) {
    console.log(`⚠️ [testAssetUrls] WARNING: Some asset URLs still contain placeholders!`);
    console.log(`⚠️ Please update EMAIL_ASSETS with your actual Google Drive file IDs`);
    return 'Asset URLs contain placeholders - please update with real Google Drive file IDs';
  } else {
    console.log(`✅ [testAssetUrls] All asset URLs have been configured`);
    return 'Asset URLs configured - ready to test email template';
  }
}

// Test notification email function
function testNotificationEmail() {
  console.log(`\n🔔 [testNotificationEmail] Testing admin notification email`);
  console.log(`🔔 [testNotificationEmail] Sending to: ${NOTIFICATION_EMAIL}`);
  
  try {
    // Create test registration data
    const testData = {
      primaryAttendee: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+65 1234 5678'
      },
      additionalAttendees: [
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+65 2345 6789'
        }
      ],
      referralCode: 'FRIEND123',
      consentGiven: true
    };
    
    const testRegistrationId = 'REG' + Date.now() + '_NOTIFICATION_TEST';
    const testTotalAttendees = 2;
    
    console.log(`🔔 [testNotificationEmail] Test registration ID: ${testRegistrationId}`);
    console.log(`🔔 [testNotificationEmail] Calling sendRegistrationNotification...`);
    
    sendRegistrationNotification(testData, testRegistrationId, testTotalAttendees);
    
    console.log(`✅ [testNotificationEmail] Test notification sent successfully!`);
    console.log(`✅ [testNotificationEmail] Check ${NOTIFICATION_EMAIL} for the notification email`);
    
    return 'Notification email test completed successfully';
    
  } catch (error) {
    console.error(`🚨 [testNotificationEmail] Test failed:`, error);
    console.error(`🚨 [testNotificationEmail] Error message:`, error.message);
    console.error(`🚨 [testNotificationEmail] Error stack:`, error.stack);
    return `Notification email test failed: ${error.message}`;
  }
}

// Email Functions
function sendConfirmationEmail(attendee, registrationId, totalAttendees, additionalAttendees, isPrimary = true) {
  console.log(`\n🔧 [sendConfirmationEmail] Starting for: ${attendee.email}`);
  console.log(`🔧 [sendConfirmationEmail] Parameters:`, {
    attendeeEmail: attendee.email,
    attendeeName: attendee.name,
    registrationId: registrationId,
    totalAttendees: totalAttendees,
    additionalAttendeesCount: additionalAttendees.length,
    isPrimary: isPrimary
  });
  
  // Check email configuration
  console.log(`🔧 [sendConfirmationEmail] Email config:`, {
    FROM_NAME: FROM_NAME,
    REPLY_TO_EMAIL: REPLY_TO_EMAIL,
    GMAIL_ADDRESS: GMAIL_ADDRESS
  });
  
  try {
    const subject = `✅ Registration Confirmed - ${EVENT_DETAILS.name}`;
    console.log(`🔧 [sendConfirmationEmail] Subject: ${subject}`);
    
    console.log(`🔧 [sendConfirmationEmail] Generating HTML body...`);
    const htmlBody = createEmailTemplate(attendee, registrationId, totalAttendees, additionalAttendees, isPrimary);
    console.log(`🔧 [sendConfirmationEmail] HTML body length: ${htmlBody.length} characters`);
    
    console.log(`🔧 [sendConfirmationEmail] Generating plain text body...`);
    const plainBody = createPlainTextEmail(attendee, registrationId, totalAttendees, additionalAttendees, isPrimary);
    console.log(`🔧 [sendConfirmationEmail] Plain body length: ${plainBody.length} characters`);
    
    // Check Gmail API availability
    console.log(`🔧 [sendConfirmationEmail] Checking GmailApp availability...`);
    if (typeof GmailApp === 'undefined') {
      throw new Error('GmailApp is not available - check Gmail permissions');
    }
    console.log(`🔧 [sendConfirmationEmail] GmailApp is available`);
    
    // Send email using Gmail API
    console.log(`🔧 [sendConfirmationEmail] Calling GmailApp.sendEmail...`);
    GmailApp.sendEmail(
      attendee.email,
      subject,
      plainBody,
      {
        htmlBody: htmlBody,
        name: FROM_NAME,
        replyTo: REPLY_TO_EMAIL
      }
    );
    console.log(`🔧 [sendConfirmationEmail] GmailApp.sendEmail completed successfully`);
    
  } catch (error) {
    console.error(`🚨 [sendConfirmationEmail] Error occurred:`, error);
    console.error(`🚨 [sendConfirmationEmail] Error message:`, error.message);
    console.error(`🚨 [sendConfirmationEmail] Error stack:`, error.stack);
    throw error; // Re-throw to be caught by calling function
  }
}

function createEmailTemplate(attendee, registrationId, totalAttendees, additionalAttendees, isPrimary = true) {
  // Simple attendee list for group registrations
  const attendeesList = isPrimary && additionalAttendees.length > 0 
    ? additionalAttendees.map(a => `<div style="color: rgba(255, 255, 255, 0.8); margin: 4px 0; font-size: 16px;">• ${a.name}</div>`).join('')
    : '';
  
  const groupSection = totalAttendees > 1 ? `
    <div style="margin: 24px 0; text-align: center;">
      <div style="width: 32px; height: 1px; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent); margin: 0 auto 16px auto;"></div>
      ${isPrimary 
        ? `<div style="color: rgba(255, 255, 255, 0.7); font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300; margin-bottom: 12px;">Group Registration (${totalAttendees} attendees)</div>
           ${attendeesList}` 
        : `<div style="color: rgba(255, 255, 255, 0.7); font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300;">Part of group registration with ${totalAttendees} attendees</div>`
      }
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited - Neuro Reset Awareness Seminar</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
      <!-- Playfair Display for event title, web-safe fonts for body text -->
    </head>
    <body style="margin: 0; padding: 0; background-image: url('${EMAIL_ASSETS.backgroundImage}'); background-size: cover; background-position: center; min-height: 500px; overflow: hidden; font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 800px; margin: 0 auto; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(60px) saturate(200%); webkit-backdrop-filter: blur(60px) saturate(200%);">
          <!-- Dark overlay for text readability -->
          <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.4);"></div>
          
          <!-- Luxury Gradient Overlay (matching InviteOverlay) -->
          <div style="position: absolute; inset: 0; background: linear-gradient(to bottom right, rgba(42, 114, 196, 0.8) 0%, rgba(42, 114, 196, 0.3) 50%, rgba(253, 186, 116, 0.7) 100%);">
            
            <!-- Additional depth overlay -->
            <div style="position: absolute; inset: 0; background: linear-gradient(to bottom right, rgba(15, 23, 42, 0.4) 0%, transparent 50%, rgba(30, 58, 138, 0.3) 100%);"></div>
          </div>

          <!-- Content Container -->
          <div style="position: relative; padding: 15px 40px; text-align: center; color: white;">
            
            <!-- Top Decorative Line -->
            <div style="margin-top: 24px;">
              <div style="width: 128px; height: 1px; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent); margin: 0 auto;"></div>
            </div>
          
            <!-- Elegant Border Frame (like InviteOverlay) -->
            <div style="position: relative; padding: 20px 30px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 24px; backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);">

              <!-- Registration Confirmed -->
              <div style="margin-bottom: 24px;">
                <h2 style="font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 300; font-size: 20px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255, 255, 255, 0.9); margin: 0 0 12px 0;">
                  Registration Confirmed
                </h2>
                <div style="width: 96px; height: 1px; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent); margin: 0 auto;"></div>
              </div>

              <!-- Event Title -->
              <h1 style="font-family: 'Playfair Display', Georgia, 'Times New Roman', Times, serif; font-weight: 700; font-size: 36px; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.02em; color: white; margin: 0 0 32px 0;">
                Neuro Reset Awareness Seminar
              </h1>

              <!-- Personal Welcome -->
              <div style="margin: 24px 0; padding: 24px; background: rgba(255, 255, 255, 0.1); border-radius: 16px; backdrop-filter: blur(5px);">
                <p style="font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; color: white; margin: 0 0 8px 0;">
                  Dear ${attendee.name},
                </p>
                <p style="font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.9); margin: 0 0 16px 0; line-height: 1.6;">
                  You are officially registered for this exclusive seminar.
                </p>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 14px; color: rgba(255, 255, 255, 0.7); margin: 0;">
                  Registration ID: ${registrationId}
                </div>
              </div>

              ${groupSection}

              <!-- Date and Time -->
              <div style="margin: 24px 0;">
                <div style="font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 300; letter-spacing: 0.05em; color: white;">
                  <div style="margin-bottom: 8px;">${EVENT_DETAILS.date}</div>
                  <div style="color: rgba(255, 255, 255, 0.9); font-size: 18px;">${EVENT_DETAILS.time}</div>
                </div>
              </div>

              <!-- Venue -->
              <div style="margin: 24px 0;">
                <div style="font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; color: white;">
                  <div style="margin-bottom: 4px;">${EVENT_DETAILS.location}</div>
                  <div style="color: rgba(255, 255, 255, 0.8); font-weight: 300; font-size: 16px;">${EVENT_DETAILS.address}</div>
                </div>
              </div>

              <!-- Quote -->
              <div style="margin: 24px 0;">
                <p style="font-family: 'Playfair Display', Georgia, 'Times New Roman', Times, serif; font-size: 18px; color: rgba(255, 255, 255, 0.7); font-weight: 700; font-style: italic; margin: 0;">
                  "Join us for an afternoon of science, healing, and discovery."
                </p>
              </div>

              <!-- Add to Calendar Button -->
              <div style="margin: 40px 0 24px 0;">
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_DETAILS.name)}&dates=20250907T070000Z/20250907T083000Z&details=${encodeURIComponent('Neuro Reset Awareness Seminar featuring Prof Andy Hsu & Dr Diana Chan')}&location=${encodeURIComponent(EVENT_DETAILS.location + ', ' + EVENT_DETAILS.address)}" 
                   style="display: inline-block; padding: 16px 48px; background: white; color: #1f2937; font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 16px; text-decoration: none; border-radius: 50px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); transition: all 0.3s ease;">
                  Add to Calendar
                </a>
              </div>

            </div>

            <!-- Bottom Decorative Line -->
            <div style="margin-top: 24px;">
              <div style="width: 128px; height: 1px; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent); margin: 0 auto;"></div>
            </div>

          </div>
        </div>

        <!-- Footer (matching event page footer) -->
        <div style="background: linear-gradient(to bottom, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 50%, rgb(15, 23, 42) 100%); padding: 12px 8px; position: relative; overflow: hidden;">
          <!-- Background Pattern -->
          <div style="position: absolute; inset: 0; opacity: 0.1; background-image: radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(253, 186, 116, 0.3) 0%, transparent 50%);"></div>
          
          <!-- Logo Section -->
          <div style="position: relative; text-align: center; margin-bottom: 0px;">
            <div style="display: inline-block; margin-bottom: 0x;">
              <img src="${EMAIL_ASSETS.logo}" alt="Dexabrain" style="height: 100px; width: auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div style="display: none; font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #1DE9B6 0%, #2979FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #1DE9B6;">
                DEXABRAIN
              </div>
            </div>
            <p style="color: rgba(255, 255, 255, 0.7); font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300; margin: 0; line-height: 1.6;">
              Pioneering the future of neurological wellness through<br>innovative research and holistic care solutions.
            </p>
          </div>

          <!-- Contact Information -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="color: rgba(255, 255, 255, 0.6); font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; margin-bottom: 12px;">
              Questions about your registration?
            </div>
            <div style="color: #1DE9B6; font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600;">
              ${REPLY_TO_EMAIL} • +65 1234 5678
            </div>
          </div>

          <!-- Footer Bottom -->
          <div style="text-align: center; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: rgba(255, 255, 255, 0.6); font-family: 'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; margin: 0;">
              © 2025 Dexabrain. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

function createPlainTextEmail(attendee, registrationId, totalAttendees, additionalAttendees, isPrimary = true) {
  let additionalInfo = '';
  
  if (totalAttendees > 1) {
    if (isPrimary) {
      const otherAttendees = additionalAttendees.map(a => `- ${a.name} (${a.email})`).join('\n');
      additionalInfo = `\n\nOTHER ATTENDEES (${additionalAttendees.length}):\n${otherAttendees}`;
    } else {
      additionalInfo = `\n\nGROUP REGISTRATION:\nYou are part of a group registration with ${totalAttendees} total attendees.`;
    }
  }

  return `
REGISTRATION CONFIRMED - ${EVENT_DETAILS.name}
========================================

Hello ${attendee.name}!

Your registration for the ${EVENT_DETAILS.name} has been confirmed. 
We're excited to have you join us for this premium experience!

REGISTRATION DETAILS:
========================================
Registration ID: ${registrationId}
Total Attendees: ${totalAttendees}
Your Email: ${attendee.email}${additionalInfo}

EVENT INFORMATION:
========================================
Date: ${EVENT_DETAILS.date}
Time: ${EVENT_DETAILS.time}
Location: ${EVENT_DETAILS.location}
Address: ${EVENT_DETAILS.address}

WHAT TO EXPECT:
========================================
• Holistic approaches to chronic pain management
• Insights from Prof Andy Hsu & Dr Diana Chan  
• Non-invasive novel techniques
• Interactive Q&A session

ADD TO CALENDAR:
========================================
Google Calendar: https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_DETAILS.name)}&dates=20250907T070000Z/20250907T083000Z

CONTACT INFORMATION:
========================================
Email: ${REPLY_TO_EMAIL}
Phone: +65 1234 5678

---
© 2025 Dexabrain. All rights reserved.
This email was sent because you registered for our premium event.
  `.trim();
}

// Send registration notification to admin
function sendRegistrationNotification(data, registrationId, totalAttendees) {
  console.log(`\n🔔 [sendRegistrationNotification] Starting for: ${registrationId}`);
  
  const primaryAttendee = data.primaryAttendee;
  const additionalAttendees = data.additionalAttendees || [];
  
  // Create attendee list
  let attendeeList = `• ${primaryAttendee.name} (${primaryAttendee.email}) - ${primaryAttendee.phone}`;
  if (additionalAttendees.length > 0) {
    additionalAttendees.forEach(attendee => {
      attendeeList += `\n• ${attendee.name} (${attendee.email}) - ${attendee.phone}`;
    });
  }
  
  // Create referral info
  const referralInfo = data.referralCode ? `\nReferral Code: ${data.referralCode}` : '';
  
  const subject = `🎯 New Registration: ${primaryAttendee.name} - ${registrationId}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: white; padding: 30px; border-radius: 10px; border-left: 5px solid #1DE9B6;">
        <h2 style="color: #2A72C4; margin-top: 0;">🎯 New Event Registration</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Registration Details</h3>
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</p>
          <p><strong>Total Attendees:</strong> ${totalAttendees}</p>
          <p><strong>Consent Given:</strong> ${data.consentGiven ? '✅ Yes' : '❌ No'}</p>
          ${referralInfo}
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">👥 Attendee Information</h3>
          <div style="font-family: monospace; font-size: 14px; line-height: 1.8;">
            ${attendeeList.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">📅 Event Information</h3>
          <p><strong>Event:</strong> ${EVENT_DETAILS.name}</p>
          <p><strong>Date:</strong> ${EVENT_DETAILS.date}</p>
          <p><strong>Time:</strong> ${EVENT_DETAILS.time}</p>
          <p><strong>Location:</strong> ${EVENT_DETAILS.location}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This notification was automatically generated by the Dexabrain Registration System
          </p>
        </div>
      </div>
    </div>
  `;
  
  const plainBody = `
NEW EVENT REGISTRATION NOTIFICATION
===================================

Registration ID: ${registrationId}
Registration Time: ${new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
Total Attendees: ${totalAttendees}
Consent Given: ${data.consentGiven ? 'Yes' : 'No'}${referralInfo}

ATTENDEE INFORMATION:
${attendeeList}

EVENT INFORMATION:
Event: ${EVENT_DETAILS.name}
Date: ${EVENT_DETAILS.date}
Time: ${EVENT_DETAILS.time}
Location: ${EVENT_DETAILS.location}

---
This notification was automatically generated by the Dexabrain Registration System
  `.trim();
  
  console.log(`🔔 [sendRegistrationNotification] Sending to: ${NOTIFICATION_EMAIL}`);
  console.log(`🔔 [sendRegistrationNotification] Subject: ${subject}`);
  
  GmailApp.sendEmail(
    NOTIFICATION_EMAIL,
    subject,
    plainBody,
    {
      htmlBody: htmlBody,
      name: 'Dexabrain Registration System',
      replyTo: REPLY_TO_EMAIL
    }
  );
  
  console.log(`✅ [sendRegistrationNotification] Notification sent successfully`);
}

// Helper function to update email sent status for all attendees
function updateEmailSentStatusForAllAttendees(sheet, registrationId, emailResults) {
  console.log(`\n🔧 [updateEmailSentStatusForAllAttendees] Starting for registration: ${registrationId}`);
  console.log(`🔧 [updateEmailSentStatusForAllAttendees] Email results count: ${emailResults.length}`);
  
  try {
    // Get all data from the sheet
    console.log(`🔧 [updateEmailSentStatusForAllAttendees] Getting sheet data...`);
    const data = sheet.getDataRange().getValues();
    console.log(`🔧 [updateEmailSentStatusForAllAttendees] Sheet has ${data.length} rows`);
    
    let updatesCount = 0;
    
    // Find all rows with matching registration ID and update email status
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip headers
      const row = data[i];
      const rowRegistrationId = row[1]; // Registration ID is in column B (index 1)
      const attendeeEmail = row[4]; // Email is in column E (index 4)
      
      console.log(`🔧 [updateEmailSentStatusForAllAttendees] Row ${i}: RegID=${rowRegistrationId}, Email=${attendeeEmail}`);
      
      if (rowRegistrationId === registrationId) {
        console.log(`🔧 [updateEmailSentStatusForAllAttendees] Found matching row for registration ${registrationId}`);
        
        // Find the corresponding email result for this attendee
        const emailResult = emailResults.find(result => result.attendee.email === attendeeEmail);
        
        if (emailResult) {
          const emailSentStatus = emailResult.emailSent ? new Date().toISOString() : 'Failed';
          
          console.log(`🔧 [updateEmailSentStatusForAllAttendees] Updating row ${i + 1}, column 11 with: ${emailSentStatus}`);
          
          // Update column K (index 10) - "Confirmation Email Sent"
          sheet.getRange(i + 1, 11).setValue(emailSentStatus);
          updatesCount++;
          console.log(`✅ Email status updated for ${attendeeEmail}: ${emailSentStatus}`);
        } else {
          console.log(`⚠️ No email result found for ${attendeeEmail}`);
        }
      }
    }
    
    console.log(`🔧 [updateEmailSentStatusForAllAttendees] Completed. Updated ${updatesCount} rows`);
    
  } catch (error) {
    console.error('🚨 [updateEmailSentStatusForAllAttendees] Failed to update email sent status:', error);
    console.error('🚨 [updateEmailSentStatusForAllAttendees] Error details:', error.toString());
    console.error('🚨 [updateEmailSentStatusForAllAttendees] Error stack:', error.stack);
  }
}

// Legacy helper function for backward compatibility
function updateEmailSentStatus(sheet, registrationId, emailSent) {
  try {
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Find the primary attendee row with matching registration ID
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip headers
      const row = data[i];
      const rowRegistrationId = row[1]; // Registration ID is in column B (index 1)
      const attendeeType = row[2]; // Attendee Type is in column C (index 2)
      
      // Update only the primary attendee row
      if (rowRegistrationId === registrationId && attendeeType === 'primary') {
        const emailSentStatus = emailSent ? new Date().toISOString() : 'Failed';
        
        // Update column K (index 10) - "Confirmation Email Sent"
        sheet.getRange(i + 1, 11).setValue(emailSentStatus);
        console.log(`Email status updated for ${registrationId}: ${emailSentStatus}`);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to update email sent status:', error);
  }
}