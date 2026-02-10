const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getPinnedQuestions
} = require('../controllers/sessionController');

// Session routes
router.route('/')
  .get(getSessions)
  .post(createSession);

router.route('/:id')
  .get(getSession)
  .put(updateSession)
  .delete(deleteSession);

router.get('/:id/pinned', getPinnedQuestions);

module.exports = router;
