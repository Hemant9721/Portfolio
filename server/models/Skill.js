const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: { type: Number, required: true, min: 0, max: 100 }
}, { _id: false });

const skillGroupSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  color: { type: String, default: '#7c3aed' },
  order: { type: Number, default: 0 },
  skills: [skillItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('SkillGroup', skillGroupSchema);
