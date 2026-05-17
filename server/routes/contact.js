const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

/** Only the public contact form — admin GET/PATCH/DELETE must not share this budget */
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many contact attempts, please try again later.' }
});

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

// PUBLIC: Submit contact form
router.post('/', contactFormLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `[Portfolio] ${subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366f1;">New Contact Message</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin-top:12px;">
                <p style="margin:0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color:#888;font-size:12px;margin-top:16px;">Sent from your portfolio contact form</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Get all messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Get unread count — MUST be before /:id
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Contact.countDocuments({ read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Mark all as read — MUST be before /:id
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    await Contact.updateMany({ read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Mark single message as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
