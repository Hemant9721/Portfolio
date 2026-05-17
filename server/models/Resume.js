const mongoose = require('mongoose');

// Stores the resume PDF as binary data — separate from About to avoid
// hitting MongoDB's 16MB BSON document limit on the About document.
const resumeSchema = new mongoose.Schema({
  data:        { type: Buffer, required: true },
  contentType: { type: String, default: 'application/pdf' },
  filename:    { type: String, default: 'resume.pdf' },
  size:        { type: Number },
  uploadedAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', resumeSchema);
