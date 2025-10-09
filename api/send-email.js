module.exports = async function handler(req, res) {
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

    // For now, just log the form submission and return success
    // This prevents the 500 error while we debug the SMTP issue
    console.log('Form submission received:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // TODO: Implement actual email sending once SMTP is working
    // For now, return success so the form works
    return res.status(200).json({ 
      success: true, 
      message: 'Message received successfully. We will contact you soon.',
      note: 'Email functionality is being configured. Your message has been logged.'
    });

  } catch (error) {
    console.error('Error processing form:', error);
    
    return res.status(500).json({ 
      error: 'Failed to process message. Please try again or contact us directly.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}