const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/questions.js");
const { generateExplanation } = require("../services/aiService.js");

const router = express.Router();

/**
 * GET /questions
 * Get all questions
 */
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().populate("session");
    res.json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /questions/pinned/all
 * Get all pinned questions
 */
router.get("/pinned/all", async (req, res) => {
  try {
    const pinnedQuestions = await Question.find({ isPinned: true });
    res.json(pinnedQuestions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /questions/:id
 * Get single question by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /questions/:id/pin
 * Toggle a question's pinned state
 */
router.put("/:id/pin", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Accept an explicit isPinned in the body if provided, otherwise flip
    // the current value — matches how the frontend calls this (no body).
    question.isPinned =
      typeof req.body?.isPinned === "boolean" ? req.body.isPinned : !question.isPinned;

    await question.save();

    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /questions/:id/explain
 * Get an AI explanation for a question, and save it so it survives a reload
 */
router.post("/:id/explain", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let explanation;
    try {
      explanation = await generateExplanation({
        question: question.question,
        answer: question.answer,
      });
    } catch (aiError) {
      console.error("Explanation generation failed:", aiError.message);
      return res.status(aiError.status || 502).json({
        message: aiError.message,
        code: aiError.code,
      });
    }

    question.aiExplanation = explanation;
    await question.save();

    res.json({
      question: question.question,
      explanation,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /questions/:id
 * Delete question
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
