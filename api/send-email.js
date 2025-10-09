const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
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

    // Initialize SendGrid with API key from environment variable
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Email content
    const emailContent = {
      to: 'crew@oceanline.space',
      from: 'crew@oceanline.space', // Must be verified in SendGrid
      replyTo: email, // This allows you to reply directly to the sender
      subject: `Contact Form: ${subject}`,
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
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    .header {
      background: linear-gradient(135deg, #0066cc 0%, #003366 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 5px;
    }
    .field-value {
      padding: 10px;
      background-color: #f5f5f5;
      border-left: 3px solid #0066cc;
      margin-top: 5px;
    }
    .message-box {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      border-left: 3px solid #0066cc;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🌊 New Contact Form Submission</h2>
      <p>Ocean Line LLC Website</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">📧 From:</div>
        <div class="field-value">${name} &lt;${email}&gt;</div>
      </div>
      
      <div class="field">
        <div class="field-label">📋 Subject:</div>
        <div class="field-value">${subject}</div>
      </div>
      
      <div class="field">
        <div class="field-label">💬 Message:</div>
        <div class="message-box">${message}</div>
      </div>
      
      <div class="footer">
        <p>This message was sent from the Ocean Line LLC contact form.</p>
        <p>Reply to this email to respond directly to ${name} at ${email}.</p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send email
    await sgMail.send(emailContent);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return a user-friendly error message
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

