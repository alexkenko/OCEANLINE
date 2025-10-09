// Simple email forwarding using mailto or form-to-email service
// This handles the contact form submission and formats it for email delivery

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Use nodemailer with SMTP
    const nodemailer = require('nodemailer');

    // Create transporter - using your oceanline.space email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com', // or your actual SMTP server
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'crew@oceanline.space',
        pass: process.env.SMTP_PASSWORD
      }
    });

    // Email options
    const mailOptions = {
      from: `"Ocean Line Contact Form" <crew@oceanline.space>`,
      to: 'crew@oceanline.space',
      replyTo: `"${name}" <${email}>`,
      subject: `Contact Form: ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #0066cc 0%, #003366 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .field {
      margin-bottom: 25px;
    }
    .field-label {
      font-weight: 700;
      color: #0066cc;
      margin-bottom: 8px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field-value {
      padding: 12px;
      background-color: #f8f9fa;
      border-left: 4px solid #0066cc;
      margin-top: 5px;
      border-radius: 4px;
    }
    .message-box {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #0066cc;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 15px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e9ecef;
      font-size: 13px;
      color: #6c757d;
      text-align: center;
    }
    .footer strong {
      color: #0066cc;
    }
    .icon {
      display: inline-block;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌊 New Contact Form Submission</h1>
      <p>Ocean Line LLC Website</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label"><span class="icon">👤</span>From</div>
        <div class="field-value"><strong>${name}</strong></div>
      </div>
      
      <div class="field">
        <div class="field-label"><span class="icon">📧</span>Email</div>
        <div class="field-value">${email}</div>
      </div>
      
      <div class="field">
        <div class="field-label"><span class="icon">📋</span>Subject</div>
        <div class="field-value">${subject}</div>
      </div>
      
      <div class="field">
        <div class="field-label"><span class="icon">💬</span>Message</div>
        <div class="message-box">${message}</div>
      </div>
      
      <div class="footer">
        <p>This message was sent from the <strong>Ocean Line LLC</strong> contact form at <strong>oceanline.space</strong></p>
        <p>Reply to this email to respond directly to <strong>${name}</strong> at <strong>${email}</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
New contact form submission from Ocean Line LLC website:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the Ocean Line LLC contact form.
Reply to this email to respond directly to ${name} at ${email}.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
