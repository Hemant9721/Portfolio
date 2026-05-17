const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  techStack: [{ type: String, trim: true }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  category: {
    type: String,
    enum: ['fullstack', 'frontend', 'backend', 'mobile', 'other'],
    default: 'fullstack'
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
