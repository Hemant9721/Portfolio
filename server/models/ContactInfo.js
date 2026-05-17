const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  email: { type: String, default: 'dcsoni2480@gmail.com' },
  phone: { type: String, default: '+91 8852 003 726' },
  location: { type: String, default: 'Sikar, Rajasthan, India' },
  availabilityNote: { type: String, default: "I'm a final-year CSE student actively looking for full-time roles and internships in Full Stack Development and Frontend Engineering." },
  githubUrl: { type: String, default: 'https://github.com/Hemant9721' },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/hemant-soni-28235a2ba/' },
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
