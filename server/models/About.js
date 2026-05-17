const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  icon:  { type: String, default: 'GraduationCap' },
  year:  { type: String, default: '' },
  title: { type: String, default: '' },
  org:   { type: String, default: '' },
  desc:  { type: String, default: '' },
  color: { type: String, default: '#7c3aed' },
});

const statSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
});

const aboutSchema = new mongoose.Schema({
  bio:      [{ type: String }],
  stats:    [statSchema],
  timeline: [timelineItemSchema],
  // resumeUrl removed — resume is now stored as binary in the Resume collection
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
