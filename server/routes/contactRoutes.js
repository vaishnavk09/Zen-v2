const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message too short' });
    }

    // Email to your team
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Zen App - New Contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for reaching out to Zen!',
      html: `
        <h2>Hi ${name}! 👋</h2>
        <p>Thank you for contacting the Zen Wellness team.</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <br/>
        <p>Take care,</p>
        <p><strong>The Zen Team 🧘</strong></p>
      `
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;