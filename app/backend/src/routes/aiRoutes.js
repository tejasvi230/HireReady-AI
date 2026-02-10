const express = require('express');
const router = express.Router();
const {
  generateQuestions,
  generateExplanation,
  improveAnswer
} = require('../controllers/aiController');

// Generate interview questions
router.post('/generate-questions', generateQuestions);

// Generate AI explanation
router.post('/explain', generateExplanation);

// Improve answer
router.post('/improve-answer', improveAnswer);

module.exports = router;
