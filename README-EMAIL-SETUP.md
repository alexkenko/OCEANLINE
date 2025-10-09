# Email Setup Guide for Ocean Line LLC Contact Form

## Overview
The contact form now sends real emails to `crew@oceanline.space` using SendGrid email service through Vercel serverless functions.

## Setup Instructions

### 1. Create a SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/) and create a free account
2. Free tier includes 100 emails/day which should be sufficient for contact form submissions

### 2. Verify Your Domain/Email
1. In SendGrid dashboard, go to **Settings > Sender Authentication**
2. Choose **Single Sender Verification** (quickest option)
3. Add `crew@oceanline.space` as your verified sender
4. Click the verification link sent to that email

### 3. Create an API Key
1. In SendGrid dashboard, go to **Settings > API Keys**
2. Click **Create API Key**
3. Name it something like "Ocean Line Contact Form"
4. Choose **Restricted Access** and enable only **Mail Send** permission
5. Click **Create & View**
6. Copy the API key (you won't be able to see it again!)

### 4. Add API Key to Vercel
1. Go to your Vercel dashboard
2. Select your Ocean Line project
3. Go to **Settings > Environment Variables**
4. Add a new variable:
   - **Name**: `SENDGRID_API_KEY`
   - **Value**: (paste your SendGrid API key)
   - **Environment**: Check all (Production, Preview, Development)
5. Click **Save**

### 5. Deploy to Vercel
```bash
git add .
git commit -m "Add real email functionality to contact form"
git push
```

Vercel will automatically deploy the changes.

## Testing

### Local Testing
1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your SendGrid API key
3. Install Vercel CLI: `npm install -g vercel`
4. Run: `vercel dev`
5. Open your browser and test the contact form

### Production Testing
1. After deployment, visit your live site
2. Fill out the contact form
3. Submit and check `crew@oceanline.space` for the email

## Features

### Form Functionality
- ✅ Real-time validation
- ✅ Loading state (button shows "Sending...")
- ✅ Beautiful success/error notifications
- ✅ Responsive design
- ✅ Prevents duplicate submissions

### Email Features
- ✅ Professional HTML email template with Ocean Line branding
- ✅ Includes sender's name and email
- ✅ Reply-To automatically set to sender's email
- ✅ Plain text fallback for email clients
- ✅ Beautiful formatted message

### Security
- ✅ Server-side validation
- ✅ Email format validation
- ✅ CORS protection
- ✅ Rate limiting (via Vercel)
- ✅ Secure API key storage

## Email Template Preview

The emails sent to `crew@oceanline.space` will include:
- Ocean Line LLC branding header with wave emoji
- Clear sender information (Name + Email)
- Subject line
- Message content in a formatted box
- Footer with instructions to reply
- Professional blue color scheme matching your brand

## Troubleshooting

### "Email service not configured" error
- Make sure `SENDGRID_API_KEY` is set in Vercel environment variables
- Redeploy after adding the environment variable

### Emails not arriving
- Check SendGrid dashboard for delivery logs
- Verify that `crew@oceanline.space` is verified in SendGrid
- Check spam folder
- Ensure SendGrid account is active

### Form not submitting
- Check browser console for errors
- Ensure JavaScript is enabled
- Try in different browser
- Check Vercel function logs

## Alternative: Using Resend (Optional)

If you prefer to use Resend instead of SendGrid:

1. Sign up at [Resend](https://resend.com/)
2. Install: `npm install resend`
3. Modify `api/send-email.js` to use Resend instead
4. Add `RESEND_API_KEY` environment variable

Resend offers 100 emails/day on free tier and has a simpler setup.

## Support

For issues or questions:
- Email: crew@oceanline.space
- Check Vercel function logs in dashboard
- Check SendGrid delivery logs

