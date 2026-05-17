const express  = require('express');
const router   = express.Router();
const About    = require('../models/About');
const Resume   = require('../models/Resume');
const auth     = require('../middleware/auth');

const DEFAULT_ABOUT = {
  bio: [
    "I'm Hemant Soni, a passionate Full Stack Developer and final-year B.Tech CSE student at Parul University (Class of 2026).",
    "My journey into tech started with curiosity and evolved into a deep love for building real-time, scalable web applications. I specialize in the MERN stack, and I've worked with Socket.IO, Firebase, Cloudinary, Tailwind CSS, and Zustand across multiple production-grade projects.",
    "I believe in clean code, thoughtful architecture, and user-first design. When I'm not building, I'm exploring new technologies and contributing to open source."
  ],
  stats: [
    { value: '10+', label: 'Projects Built' },
    { value: '2+', label: 'Years Coding'    },
    { value: '3+',  label: 'Partners'       },
    { value: '100%',label: 'Dedication'     },
  ],
  timeline: [
    { icon:'GraduationCap', year:'2022–2026', title:'B.Tech Computer Science & Engineering', org:'Parul University, Vadodara',       desc:'Graduating 2026. Core focus on full-stack development, data structures, and system design.', color:'#7c3aed' },
    { icon:'Briefcase',     year:'2024',      title:'Web Development Intern',                 org:'TechnoHacks Solutions Pvt. Ltd.', desc:'Built a real-time chat application using MERN stack and Socket.IO. Contributed to production codebase.', color:'#06b6d4' },
    { icon:'Code2',         year:'2023–Present', title:'Open Source & Personal Projects',     org:'Independent',                    desc:'Developed multiple full-stack applications — WhatsApp-style chat apps, secure exam platform, AI-powered tools.', color:'#f59e0b' },
  ],
  hasResume: false,
};

// ── PUBLIC: get about data (no base64, just hasResume flag + filename) ───────
router.get("/", async (req, res) => {
  try {
    const about  = await About.findOne();
    const resume = await Resume.findOne().sort({ uploadedAt: -1 }).select('filename size uploadedAt');
    const hasResume = !!resume;

    if (!about) return res.json({ ...DEFAULT_ABOUT, hasResume, resumeFilename: resume?.filename || "" });

    res.json({
      ...about.toObject(),
      hasResume,
      resumeFilename: resume?.filename || "",
      resumeSize:     resume?.size     || 0,
      resumeUploadedAt: resume?.uploadedAt || null,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUBLIC: download resume ────────────────────────────────────────────────
router.get('/resume/download', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) return res.status(404).json({ message: 'No resume uploaded' });

    const fname = resume.filename || 'Hemant_Soni_Resume.pdf';

    // Clear any CSP/cache headers that could block the download
    res.removeHeader('Content-Security-Policy');
    res.set({
      'Content-Type':              'application/pdf',
      'Content-Disposition':       `attachment; filename="\"`,
      'Content-Length':            resume.data.length,
      'Cache-Control':             'no-cache, no-store, must-revalidate',
      'Pragma':                    'no-cache',
      'X-Content-Type-Options':    'nosniff',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });
    res.end(resume.data);
  } catch (err) {
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
});

// ── ADMIN: save bio/stats/timeline (no resume here) ───────────────────────
router.put('/', auth, async (req, res) => {
  try {
    const { bio, stats, timeline } = req.body;
    let about = await About.findOne();
    if (!about) {
      about = new About({ bio, stats, timeline });
    } else {
      if (bio      !== undefined) about.bio      = bio;
      if (stats    !== undefined) about.stats    = stats;
      if (timeline !== undefined) about.timeline = timeline;
    }
    await about.save();
    const hasResume = (await Resume.countDocuments()) > 0;
    res.json({ ...about.toObject(), hasResume });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── ADMIN: upload resume (base64 from client → Buffer in DB) ──────────────
router.post('/resume/upload', auth, async (req, res) => {
  try {
    const { base64, filename } = req.body;
    if (!base64) return res.status(400).json({ message: 'No file data received' });

    // Strip the data URI prefix if present: "data:application/pdf;base64,<data>"
    const raw = base64.includes(',') ? base64.split(',')[1] : base64;
    const buffer = Buffer.from(raw, 'base64');

    if (buffer.length > 8 * 1024 * 1024)
      return res.status(413).json({ message: 'File too large (max 8 MB)' });

    // Upsert — only one resume at a time
    await Resume.deleteMany({});
    const resume = new Resume({
      data:        buffer,
      contentType: 'application/pdf',
      filename:    filename || 'Hemant_Soni_Resume.pdf',
      size:        buffer.length,
    });
    await resume.save();

    res.json({ message: 'Resume uploaded successfully', size: buffer.length });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// ── ADMIN: delete resume ───────────────────────────────────────────────────
router.delete('/resume', auth, async (req, res) => {
  try {
    await Resume.deleteMany({});
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
