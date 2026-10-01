const mongoose = require("mongoose");
const Session = require("../models/sessions.js");
const Question = require("../models/questions.js");
const { generateQuestionBatch } = require("../services/aiService.js");

const TOTAL_QUESTIONS = 30;
const BATCH_SIZE = 5;
const MAX_BATCHES = 8;
const VALID_DIFFICULTIES = ["easy", "medium", "hard", "expert"];
const inProgress = new Set();

function sanitizeQuestion(raw, category, sessionId) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.question !== "string" || !raw.question.trim()) return null;
  if (typeof raw.answer !== "string" || !raw.answer.trim()) return null;
  return {
    session: sessionId,
    question: raw.question.trim(),
    answer: raw.answer.trim(),
    difficulty: VALID_DIFFICULTIES.includes(raw.difficulty) ? raw.difficulty : "medium",
    tags: Array.isArray(raw.tags) ? raw.tags.filter(t => typeof t === "string" && t.trim()).map(t => t.trim()) : [],
    category,
  };
}

const generateQuestions = async (req, res) => {
  const sessionId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ success: false, message: "Invalid session ID" });
  }
  if (inProgress.has(sessionId)) {
    return res.status(409).json({ success: false, message: "Questions are already being generated for this session. Please wait." });
  }
  inProgress.add(sessionId);
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    const { jobRole, experienceLevel, category } = session;
    const questionsWithMeta = [];
    const seen = new Set();
    let lastError;
    const deadline = Date.now() + 145000;

    for (let attempt = 0; attempt < MAX_BATCHES && questionsWithMeta.length < TOTAL_QUESTIONS; attempt++) {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) break;
      try {
        const batch = await generateQuestionBatch({
          jobRole, experienceLevel, category,
          count: Math.min(BATCH_SIZE, TOTAL_QUESTIONS - questionsWithMeta.length),
          previousQuestions: questionsWithMeta.map(q => q.question),
          timeoutMs: Math.min(40000, remainingMs),
        });
        for (const raw of batch) {
          const question = sanitizeQuestion(raw, category, sessionId);
          if (!question) continue;
          const key = question.question.toLowerCase().replace(/\s+/g, " ");
          if (seen.has(key)) continue;
          seen.add(key);
          questionsWithMeta.push(question);
          if (questionsWithMeta.length === TOTAL_QUESTIONS) break;
        }
      } catch (error) {
        lastError = error;
        console.error("Question batch failed:", error.message);
        if (["AI_CONFIG", "AI_AUTH", "AI_CREDITS", "AI_RATE_LIMIT", "AI_TIMEOUT", "AI_PROVIDER"].includes(error.code)) break;
      }
    }
    if (!questionsWithMeta.length) {
      return res.status(lastError?.status || 502).json({
        success: false,
        message: lastError?.message || "The AI returned no valid questions. Please retry this saved session.",
        code: lastError?.code || "AI_RESPONSE",
      });
    }
    const savedQuestions = await Question.insertMany(questionsWithMeta);
    session.questions.push(...savedQuestions.map(q => q._id));
    session.updatedAt = Date.now();
    await session.save();
    return res.status(200).json({
      success: true,
      count: savedQuestions.length,
      requested: TOTAL_QUESTIONS,
      partial: savedQuestions.length < TOTAL_QUESTIONS,
      message: savedQuestions.length < TOTAL_QUESTIONS ? `Saved ${savedQuestions.length} of ${TOTAL_QUESTIONS} questions. ${lastError?.message || "The AI returned fewer unique questions than requested."}` : undefined,
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Error generating questions:", error.message);
    return res.status(500).json({ success: false, message: "Could not save generated questions. Check the backend database connection and retry." });
  } finally {
    inProgress.delete(sessionId);
  }
};
module.exports = { generateQuestions };
