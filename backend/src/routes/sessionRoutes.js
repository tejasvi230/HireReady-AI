const express = require("express");
const mongoose = require("mongoose");
const Session = require("../models/sessions.js");
const { generateQuestions } = require("../controllers/aiController");

const router = express.Router();

// Create Session
router.post("/", async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Pinned Sessions
router.get("/pinned/all", async (req, res) => {
  try {
    const pinnedSessions = await Session.find({ isPinned: true });
    res.json(pinnedSessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:id/generate", generateQuestions);

// Get Single Session (with its questions populated, not just their IDs)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findById(id).populate("questions");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Session
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findByIdAndUpdate(id, req.body, {
      new: true, // return updated doc
      runValidators: true,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Session
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
