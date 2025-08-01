import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json();
    
    // Validate required fields
    if (!data.primaryAttendee?.name || !data.primaryAttendee?.email || !data.primaryAttendee?.phone) {
      return NextResponse.json(
        { success: false, message: 'Primary attendee information is required' },
        { status: 400 }
      );
    }

    if (!data.consentGiven) {
      return NextResponse.json(
        { success: false, message: 'Privacy consent is required' },
        { status: 400 }
      );
    }

    // Validate additional attendees if present
    if (data.additionalAttendees && data.additionalAttendees.length > 0) {
      for (const attendee of data.additionalAttendees) {
        if (!attendee.name || !attendee.email || !attendee.phone) {
          return NextResponse.json(
            { success: false, message: 'All attendee information is required' },
            { status: 400 }
          );
        }
      }
    }

    // Get Google Apps Script URL from environment
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL environment variable not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare data for Google Apps Script
    const scriptData = {
      action: 'register',
      primaryAttendee: data.primaryAttendee,
      additionalAttendees: data.additionalAttendees || [],
      referralCode: data.referralCode || '',
      consentGiven: data.consentGiven
    };

    // Send to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scriptData)
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Registration failed' },
        { status: 400 }
      );
    }

    // Send confirmation email (optional - implement later)
    // await sendConfirmationEmail(result.data);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        registrationId: result.data.registrationId,
        totalAttendees: result.data.totalAttendees,
        primaryAttendee: data.primaryAttendee
      }
    });

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}