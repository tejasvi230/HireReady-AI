const express = require('express');
const router = express.Router();
const {
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  togglePin,
  getAllPinnedQuestions,
  addAIExplanation
} = require('../controllers/questionController');

// Get all pinned questions (across all sessions)
router.get('/pinned', getAllPinnedQuestions);

// Question routes for a session
router.route('/session/:sessionId')
  .get(getQuestions)
  .post(addQuestion);

// Individual question routes
router.route('/:id')
  .get(getQuestion)
  .put(updateQuestion)
  .delete(deleteQuestion);

// Toggle pin status
router.put('/:id/pin', togglePin);

// Add AI explanation
router.put('/:id/explanation', addAIExplanation);

module.exports = router;
