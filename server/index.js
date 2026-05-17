require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,   // Allow file downloads without CSP blocking
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting (strict contact-form limits are applied only on POST /api/contact in routes/contact.js)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api/', limiter);

// Increased limit for base64 resume PDF uploads (up to 15MB)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/about', require('./routes/about'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/contact-info', require('./routes/contactInfo'));

app.get('/api/health', (_, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Connect DB & start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('⚠️  Starting server without DB connection...');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (no DB)`));
  });

module.exports = app;
