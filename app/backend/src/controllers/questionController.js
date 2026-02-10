const Question = require('../models/Question');
const Session = require('../models/Session');

// Add question to session
const addQuestion = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { question, answer, category, difficulty, tags } = req.body;

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Create question
    const newQuestion = await Question.create({
      session: sessionId,
      question,
      answer,
      category,
      difficulty,
      tags: tags || [],
      isPinned: false
    });

    // Add question to session
    session.questions.push(newQuestion._id);
    await session.save();

    res.status(201).json({
      success: true,
      data: newQuestion
    });

  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding question',
      error: error.message
    });
  }
};

// Get all questions for a session
const getQuestions = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { category, difficulty, isPinned } = req.query;

    let query = { session: sessionId };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isPinned !== undefined) query.isPinned = isPinned === 'true';

    const questions = await Question.find(query)
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// Get single question
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const { question, answer, category, difficulty, tags, aiExplanation } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, answer, category, difficulty, tags, aiExplanation },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedQuestion
    });

  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Remove question from session
    await Session.findByIdAndUpdate(
      question.session,
      { $pull: { questions: question._id } }
    );

    // Delete question
    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
};

// Toggle pin status
const togglePin = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({
      success: true,
      data: question,
      message: question.isPinned ? 'Question pinned' : 'Question unpinned'
    });

  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling pin',
      error: error.message
    });
  }
};

// Get all pinned questions across all sessions
const getAllPinnedQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isPinned: true })
      .populate('session', 'title jobRole')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    console.error('Error fetching pinned questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pinned questions',
      error: error.message
    });
  }
};

// Add AI explanation to question
const addAIExplanation = async (req, res) => {
  try {
    const { aiExplanation } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { aiExplanation },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    console.error('Error adding AI explanation:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding AI explanation',
      error: error.message
    });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  togglePin,
  getAllPinnedQuestions,
  addAIExplanation
};
