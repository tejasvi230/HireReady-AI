const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a session title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  jobRole: {
    type: String,
    required: [true, 'Please provide a job role'],
    trim: true
  },
  experienceLevel: {
    type: String,
    required: [true, 'Please provide experience level'],
    enum: ['entry', 'mid', 'senior', 'expert']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['technical', 'behavioral', 'system-design', 'coding', 'mixed']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
