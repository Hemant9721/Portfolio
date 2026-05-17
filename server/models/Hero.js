const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  greeting: { type: String, default: "Hello, I'm" },
  firstName: { type: String, default: 'Hemant' },
  lastName: { type: String, default: 'Soni' },
  roles: [{ type: String }],
  tagline: { type: String, default: "B.Tech CSE student at Parul University — building real-time, full-stack applications with the MERN stack, Socket.IO, Firebase, and modern web technologies." },
  availableText: { type: String, default: 'Available for opportunities' },
  githubUrl: { type: String, default: 'https://github.com/Hemant9721' },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/hemant-soni-28235a2ba/' },
  email: { type: String, default: 'dcsoni2480@gmail.com' },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
