import { NextRequest, NextResponse } from 'next/server';

interface NewsletterData {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: NewsletterData = await request.json();
    
    // Validate email
    if (!data.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
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
      action: 'newsletter',
      email: data.email
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
        { success: false, message: result.message || 'Newsletter subscription failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email: data.email
      }
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}