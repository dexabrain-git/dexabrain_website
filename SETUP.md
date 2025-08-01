# Setup Guide: Google Sheets Integration

This guide will help you set up the Google Apps Script integration for event registration and newsletter subscriptions.

## 🔧 Prerequisites

1. Google account
2. Next.js project (already set up)
3. Basic understanding of Google Sheets and Google Apps Script

## 📋 Step-by-Step Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: "Dexabrain Event Registration"
4. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
5. Keep this ID handy - you'll need it for the Apps Script

### Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. Delete the default `myFunction()` code
4. Copy and paste the entire code from `google-apps-script.js` file
5. Replace `YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID from Step 1
6. Save the project (Ctrl/Cmd + S)
7. Name your project: "Dexabrain Registration API"

### Step 3: Deploy as Web App

1. In Apps Script, click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Type"
3. Select **"Web app"**
4. Configure:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **"Deploy"**
6. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`)
7. **Important**: Keep this URL secure and private

### Step 4: Configure Email Settings

1. In your Google Apps Script, find these lines and update them:
   ```javascript
   const GMAIL_ADDRESS = 'your-gmail@gmail.com'; // Replace with your actual Gmail address
   const FROM_NAME = 'Dexabrain Team';
   const REPLY_TO_EMAIL = 'info@dexabrain.com'; // The email you want replies to go to
   ```

2. **Important**: Email Configuration Details
   - **GMAIL_ADDRESS**: Must be your actual Gmail account (the script runs under this account)
   - **FROM_NAME**: This will appear as the sender name in emails
   - **REPLY_TO_EMAIL**: This can be any email address - when recipients reply, it goes here
   - Gmail will send from your Gmail account, but replies will go to your REPLY_TO_EMAIL

### Step 5: Test the Setup

1. In Apps Script, click **"Run"** → select **"testSetup"** function
2. Grant necessary permissions when prompted:
   - **Sheets access**: To read/write your Google Sheet
   - **Gmail access**: To send confirmation emails
3. Check your Google Sheet - you should see test data appear
4. Check the test email address - you should receive a confirmation email
5. If successful, you'll see two sheets:
   - `Event_Registrations` with test registration data
   - `Newsletter_Subscriptions` with test email

### Step 6: Configure Next.js Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Web App URL:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```

3. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing the Integration

### Test Registration Flow
1. Open your website
2. Click "RESERVE A SPOT" or "JOIN NOW!"
3. Fill out the registration form with test data
4. Submit the form
5. Check your Google Sheet - new registration data should appear

### Test Newsletter Subscription
1. Scroll to the footer
2. Enter an email in the newsletter subscription form
3. Click "SUBSCRIBE"
4. Check your Google Sheet - new email should appear in Newsletter_Subscriptions

## 📊 Data Structure

### Event_Registrations Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Timestamp | When registration was submitted |
| B | Registration ID | Unique ID (REG + timestamp) |
| C | Attendee Type | "primary" or "additional" |
| D | Name | Attendee name |
| E | Email | Attendee email |
| F | Phone | Attendee phone |
| G | Total in Group | Total attendees in this registration |
| H | Referral Code | Optional referral code (primary only) |
| I | Consent Given | PDPA consent (primary only) |
| J | Status | "confirmed", "pending", "cancelled" |
| K | Confirmation Email Sent | Timestamp when email sent (all attendees) |

### Newsletter_Subscriptions Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | Timestamp | When subscription occurred |
| B | Email | Subscriber email |
| C | Source | "registration" or "newsletter_form" |
| D | Status | "active" or "unsubscribed" |

## 🔍 Multi-Attendee Example

When someone registers with additional attendees, you'll see multiple rows with the same Registration ID:

```
REG1738123456 | primary    | John Doe   | john@email.com    | +65123456 | 3 | CODE1 | TRUE | confirmed | 2025-01-15T10:30:00Z
REG1738123456 | additional | Jane Smith | jane@email.com    | +65234567 | 3 |       |      | confirmed | 2025-01-15T10:30:00Z
REG1738123456 | additional | Bob Wilson | bob@email.com     | +65345678 | 3 |       |      | confirmed | 2025-01-15T10:30:00Z
```

## 🚨 Troubleshooting

### Common Issues

1. **"Server configuration error"**
   - Check that `GOOGLE_APPS_SCRIPT_URL` is set in `.env.local`
   - Restart your Next.js dev server

2. **"Registration failed"**
   - Verify Google Apps Script deployment permissions
   - Check the Apps Script execution log for errors

3. **"Access denied"**
   - Ensure the Web App is deployed with "Anyone" access
   - Re-deploy if necessary

4. **Data not appearing in sheets**
   - Verify the Sheet ID in your Apps Script
   - Check that the script has permission to edit the sheet

### Debugging Tips

1. Check browser console for errors
2. View Apps Script execution logs:
   - Go to Apps Script editor
   - Click "Executions" in left sidebar
3. Test the Apps Script directly using the `testSetup()` function

## 🔒 Security Notes

- Keep your Web App URL private
- Never commit `.env.local` to version control
- Consider implementing rate limiting for production use
- The Web App is accessible to anyone with the URL - this is required for the integration to work

## 🎉 Success!

Your Google Sheets integration is now complete! Registrations and newsletter subscriptions will automatically flow into your Google Sheet, with each attendee getting their own row for easy management.