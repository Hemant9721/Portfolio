const mongoose = require('mongoose');

// Single-document store — there's only ever one badges list
const techBadgeSchema = new mongoose.Schema({
  badges: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('TechBadge', techBadgeSchema);