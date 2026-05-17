const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo');
const auth = require('../middleware/auth');

const DEFAULT = {
  email: 'dcsoni2480@gmail.com',
  phone: '+91 8852 003 726',
  location: 'Sikar, Rajasthan, India',
  availabilityNote: "I'm a final-year CSE student actively looking for full-time roles and internships in Full Stack Development and Frontend Engineering.",
  githubUrl: 'https://github.com/Hemant9721',
  linkedinUrl: 'https://www.linkedin.com/in/hemant-soni-28235a2ba/',
};

router.get('/', async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) return res.json(DEFAULT);
    res.json(info);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = new ContactInfo(req.body);
    } else {
      Object.assign(info, req.body);
    }
    await info.save();
    res.json(info);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
