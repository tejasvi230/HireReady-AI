const Session = require('../models/Session');
const Question = require('../models/Question');

// Create a new session
const createSession = async (req, res) => {
  try {
    const { title, jobRole, experienceLevel, category, questions } = req.body;

    // Create session
    const session = await Session.create({
      title,
      jobRole,
      experienceLevel,
      category,
      questions: []
    });

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionDocs = await Question.insertMany(
        questions.map(q => ({
          session: session._id,
          question: q.question,
          answer: q.answer,
          category: q.category || category,
          difficulty: q.difficulty || 'medium',
          tags: q.tags || [],
          isPinned: false
        }))
      );

      session.questions = questionDocs.map(q => q._id);
      await session.save();
    }

    const populatedSession = await Session.findById(session._id)
      .populate('questions')
      .lean();

    res.status(201).json({
      success: true,
      data: populatedSession
    });

  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

// Get all sessions
const getSessions = async (req, res) => {
  try {
    const { jobRole, experienceLevel, category, isActive } = req.query;
    
    let query = {};
    
    if (jobRole) query.jobRole = new RegExp(jobRole, 'i');
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const sessions = await Session.find(query)
      .populate({
        path: 'questions',
        select: 'question difficulty isPinned'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// Get single session
const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('questions');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const { title, jobRole, experienceLevel, category, isActive } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { title, jobRole, experienceLevel, category, isActive },
      { new: true, runValidators: true }
    ).populate('questions');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Delete all associated questions
    await Question.deleteMany({ session: session._id });

    // Delete session
    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Session and associated questions deleted'
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
      error: error.message
    });
  }
};

// Get pinned questions from a session
const getPinnedQuestions = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const pinnedQuestions = await Question.find({
      session: session._id,
      isPinned: true
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: pinnedQuestions.length,
      data: pinnedQuestions
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

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getPinnedQuestions
};
