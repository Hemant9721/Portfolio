const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const auth = require('../middleware/auth');

const DEFAULT_HERO = {
  greeting: "Hello, I'm",
  firstName: 'Hemant',
  lastName: 'Soni',
  roles: ['Full Stack Developer', 'MERN Stack Engineer', 'React Developer', 'DSA Enthusiast'],
  tagline: "B.Tech CSE student at Parul University — building real-time, full-stack applications with the MERN stack, Socket.IO, Firebase, and modern web technologies.",
  availableText: 'Available for opportunities',
  githubUrl: 'https://github.com/Hemant9721',
  linkedinUrl: 'https://www.linkedin.com/in/hemant-soni-28235a2ba/',
  email: 'dcsoni2480@gmail.com',
};

router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) return res.json(DEFAULT_HERO);
    res.json(hero);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero(req.body);
    } else {
      Object.assign(hero, req.body);
    }
    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
