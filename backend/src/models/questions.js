const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  question: {
    type: String,
    required: [true, "Please provide a question"],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, "Please provide an answer"],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["technical", "behavioral", "system-design", "coding", "conceptual", "mixed"],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard", "expert"],
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  aiExplanation: {
    type: String,
    default: "",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
questionSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// Index for faster queries
questionSchema.index({ session: 1, isPinned: -1 });
questionSchema.index({ category: 1 });

module.exports = mongoose.model("Question", questionSchema);
