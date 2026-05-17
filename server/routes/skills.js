const express = require('express');
const router = express.Router();
const SkillGroup = require('../models/Skill');
const TechBadge = require('../models/TechBadge');
const auth = require('../middleware/auth');

const DEFAULT_BADGES = [
  'React', 'Node.js', 'MongoDB', 'Express', 'Socket.IO', 'Firebase',
  'Tailwind', 'Zustand', 'Git', 'Cloudinary', 'JWT', 'REST API',
  'Framer Motion', 'Postman', 'Vite'
];

// PUBLIC: Get all skill groups
router.get('/', async (req, res) => {
  try {
    const groups = await SkillGroup.find().sort({ order: 1, createdAt: 1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: Get tech badges  ← must be before /:id
router.get('/badges', async (req, res) => {
  try {
    const doc = await TechBadge.findOne();
    if (!doc) return res.json(DEFAULT_BADGES);
    res.json(doc.badges);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Save tech badges  ← must be before /:id
router.put('/badges', auth, async (req, res) => {
  try {
    const { badges } = req.body;
    let doc = await TechBadge.findOne();
    if (doc) {
      doc.badges = badges;
      await doc.save();
    } else {
      doc = await TechBadge.create({ badges });
    }
    res.json(doc.badges);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Seed default skills  ← must be before /:id
router.post('/seed', auth, async (req, res) => {
  try {
    const count = await SkillGroup.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded', count });

    const defaults = [
      {
        category: 'Frontend', color: '#7c3aed', order: 0,
        skills: [
          { name: 'React.js', level: 92 }, { name: 'JavaScript (ES6+)', level: 88 },
          { name: 'Tailwind CSS', level: 90 }, { name: 'HTML5 / CSS3', level: 95 },
          { name: 'Framer Motion', level: 75 }
        ]
      },
      {
        category: 'Backend', color: '#06b6d4', order: 1,
        skills: [
          { name: 'Node.js', level: 85 }, { name: 'Express.js', level: 83 },
          { name: 'Socket.IO', level: 80 }, { name: 'REST APIs', level: 88 },
          { name: 'JWT / Auth', level: 82 }
        ]
      },
      {
        category: 'Database & Cloud', color: '#f59e0b', order: 2,
        skills: [
          { name: 'MongoDB', level: 82 }, { name: 'Firebase', level: 78 },
          { name: 'Cloudinary', level: 75 }, { name: 'Mongoose ODM', level: 83 },
          { name: 'Vercel / Railway', level: 70 }
        ]
      },
      {
        category: 'Tools & Other', color: '#ec4899', order: 3,
        skills: [
          { name: 'Git & GitHub', level: 88 }, { name: 'Zustand', level: 80 },
          { name: 'Postman', level: 85 }, { name: 'VS Code', level: 95 },
          { name: 'Nodemailer', level: 75 }
        ]
      }
    ];

    await SkillGroup.insertMany(defaults);
    const groups = await SkillGroup.find().sort({ order: 1 });
    res.status(201).json({ message: 'Seeded successfully', groups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Create a skill group
router.post('/', auth, async (req, res) => {
  try {
    const group = new SkillGroup(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Update a skill group
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await SkillGroup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!group) return res.status(404).json({ message: 'Skill group not found' });
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Delete a skill group
router.delete('/:id', auth, async (req, res) => {
  try {
    await SkillGroup.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill group deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;