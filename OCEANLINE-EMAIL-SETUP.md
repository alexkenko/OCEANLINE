# 📧 Ocean Line Email Setup - Using Your Own Email Server

## ✅ Setup: Send from crew@oceanline.space to crew@oceanline.space

Your contact form now uses **nodemailer** to send emails directly from your own email server.

---

## 🔑 What You Need

Since you have email setup through Vercel for `crew@oceanline.space`, I need the **SMTP credentials** for your email account:

### Required Information:

1. **SMTP Host** (e.g., `smtp.gmail.com`, `smtp.office365.com`, or your provider)
2. **SMTP Port** (usually `587` for TLS or `465` for SSL)
3. **Email Username** (usually `crew@oceanline.space`)
4. **Email Password** (or app-specific password)
5. **Secure Connection** (`true` for SSL/465, `false` for TLS/587)

---

## 📋 Common Email Providers

### If using **Gmail** for crew@oceanline.space:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=crew@oceanline.space
SMTP_PASSWORD=[App Password - generate from Google Account settings]
```

### If using **Microsoft 365/Outlook**:
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=crew@oceanline.space
SMTP_PASSWORD=[your email password]
```

### If using **Custom SMTP** (common with domain hosting):
```
SMTP_HOST=mail.oceanline.space (or smtp.oceanline.space)
SMTP_PORT=587 (or 465)
SMTP_SECURE=false (true for 465)
SMTP_USER=crew@oceanline.space
SMTP_PASSWORD=[your email password]
```

### If using **Zoho Mail**:
```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=crew@oceanline.space
SMTP_PASSWORD=[your email password]
```

---

## 🚀 Setup Steps

### Option 1: Tell Me Your Email Provider

Just tell me:
- **"I use Gmail"** or **"I use Microsoft 365"** or **"I use [provider name]"**
- Give me the email password (or I'll guide you to create an app password)

And I'll add everything to Vercel for you automatically!

### Option 2: Manual Setup in Vercel

1. Go to https://vercel.com/dashboard
2. Select **oceanline** project
3. Settings → Environment Variables
4. Add these variables:
   - `SMTP_HOST` = (your SMTP server)
   - `SMTP_PORT` = (587 or 465)
   - `SMTP_SECURE` = (false or true)
   - `SMTP_USER` = crew@oceanline.space
   - `SMTP_PASSWORD` = (your password)
5. Select all environments (Production, Preview, Development)
6. Save

---

## 🔐 Security Note: App Passwords

If using Gmail or Microsoft 365, you should use an **App Password** instead of your regular password:

### For Gmail:
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (required)
3. Create app password named "Ocean Line Contact Form"
4. Use this password instead of your regular password

### For Microsoft 365:
1. Similar process in Microsoft Account Security settings
2. Generate app password for "Ocean Line"

---

## ✨ Benefits of This Approach

- ✅ **100% FREE** - No third-party service needed
- ✅ **Your own email** - Sends from crew@oceanline.space
- ✅ **No rate limits** (depends on your email provider)
- ✅ **Complete control** - Your server, your rules
- ✅ **More professional** - Uses your actual domain

---

## 🧪 Testing

After setup:
1. Visit your website
2. Fill out contact form
3. Submit
4. Check crew@oceanline.space inbox
5. Email will come from crew@oceanline.space

---

## ❓ Don't Know Your Email Provider?

Tell me how you set up crew@oceanline.space and I can help figure out the SMTP settings!

Common scenarios:
- **"Through Vercel Email"** - I'll check if Vercel provides SMTP
- **"Through Google Workspace"** - Use Gmail SMTP
- **"Through my domain registrar"** - I'll help find SMTP info
- **"Through hosting company"** - They should provide SMTP details

---

## 🎯 Next Steps

**Just tell me:**
1. What email provider you use for crew@oceanline.space
2. Your email password (or we'll create an app password)

**Then I'll:**
- Add all environment variables to Vercel automatically
- Deploy the updated code
- Test it for you!

---

**The code is ready - just need your SMTP credentials!** 🚀

