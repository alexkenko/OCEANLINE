# 📧 Resend Email Setup for Ocean Line LLC

## ✅ Updated to Use Resend (Easier than SendGrid!)

Your contact form now uses **Resend** - a modern email API built for developers, with simpler setup and better Vercel integration.

---

## 🚀 Quick Setup (3 Minutes)

### Step 1: Create Resend Account

1. Go to **https://resend.com/**
2. Click **"Sign Up"** (it's FREE - 100 emails/day, 3,000/month)
3. Sign up with GitHub or email

### Step 2: Get Your API Key

1. After logging in, you'll see your dashboard
2. Go to **"API Keys"** in the left sidebar
3. You'll see a default key already created, OR click **"Create API Key"**
4. **Copy the API key** (starts with `re_...`)

### Step 3: Add Domain (Optional but Recommended)

**For now, skip this - Resend will use their test domain `onboarding@resend.dev`**

Later, to send from `crew@oceanline.space`:
1. Go to **"Domains"** in Resend dashboard
2. Click **"Add Domain"**
3. Enter: `oceanline.space`
4. Add the DNS records shown (SPF, DKIM)
5. Wait for verification (usually 5-10 minutes)
6. Update the "from" address in `api/send-email.js`

### Step 4: Add API Key to Vercel

**Option A: Vercel Dashboard (Manual)**
1. Go to https://vercel.com/dashboard
2. Select your **oceanline** project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_...` (your API key)
   - Environments: ✓ Production ✓ Preview ✓ Development
5. Click **Save**

**Option B: Using Vercel CLI (Automatic)**
```bash
vercel env add RESEND_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development (press space to select, enter to confirm)
```

---

## 📤 Deploy

```bash
git add .
git commit -m "Switch to Resend for email service"
git push
```

Vercel will automatically redeploy!

---

## ✨ What You Get

### Immediate Benefits:
- ✅ **100 emails/day FREE** (3,000/month)
- ✅ **Simpler setup** than SendGrid
- ✅ **Better Vercel integration**
- ✅ **Works immediately** with test domain
- ✅ **Easy to upgrade** to custom domain later
- ✅ **Great dashboard** with email logs

### Email Features:
- ✅ Beautiful HTML emails with Ocean Line branding
- ✅ Reply-To automatically set to sender
- ✅ Plain text fallback
- ✅ Mobile responsive design
- ✅ Professional appearance

---

## 🧪 Testing

### Test with Resend Test Domain (Works Immediately):
1. Deploy your code
2. Submit the contact form on your website
3. Check `crew@oceanline.space` inbox
4. Email will come from `onboarding@resend.dev`

### After Adding Custom Domain:
- Emails will come from `Ocean Line LLC <crew@oceanline.space>`
- Looks even more professional!

---

## 🔍 Monitoring

**View sent emails:**
1. Go to Resend dashboard
2. Click **"Emails"** in sidebar
3. See all sent emails with status:
   - ✅ Delivered
   - 📬 Queued
   - ❌ Failed

**Click any email to see:**
- Full content preview
- Delivery status
- Bounce/complaint info
- Timeline of events

---

## 🎯 Why Resend > SendGrid?

| Feature | Resend | SendGrid |
|---------|---------|----------|
| Setup Time | 3 mins | 10 mins |
| Verification | Optional initially | Required |
| Free Tier | 3,000/month | 100/day |
| Dashboard | Modern & simple | Complex |
| Vercel Integration | Native | Generic |
| Email Logs | Beautiful | Basic |

---

## 🔧 Troubleshooting

### "Email service not configured"
- Ensure `RESEND_API_KEY` is set in Vercel
- Redeploy after adding the variable
- Check environment variable in Vercel settings

### Emails not arriving?
- Check Resend dashboard → Emails section
- Look for delivery status
- Check spam folder
- Verify API key is correct
- Ensure you have remaining quota

### Rate limit hit?
- Free tier: 100 emails/day, 3,000/month
- Upgrade to paid plan if needed ($20/month for 50k emails)

---

## 💰 Pricing

**Free Forever:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ All features included
- ✅ Email logs & analytics

**If you outgrow it:**
- Pro: $20/month for 50,000 emails
- Business: Custom pricing

---

## 📧 Need Help?

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Your Email**: crew@oceanline.space

---

## ✅ Next Steps

1. ✅ Resend is already integrated in your code
2. 🔑 Get your API key from Resend
3. ⚙️ Add to Vercel environment variables
4. 🚀 Deploy and test!

**That's it! Your contact form will work immediately.** 🎉

Later, when you want professional branding:
- Add oceanline.space domain to Resend
- Update DNS records
- Change "from" address in code
- Redeploy

---

**The code is ready. Just add the API key and deploy!** 🚀

