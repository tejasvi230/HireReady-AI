require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const sessionRoutes = require("./src/routes/sessionRoutes.js");
const questionRoutes = require("./src/routes/questionRoutes");

// Fail fast with a clear message rather than a cryptic Mongoose stack trace
// if the .env file wasn't actually filled in.
if (!process.env.MONGODB_URI) {
  console.error(
    "\nMissing MONGODB_URI.\n" +
      "Copy backend/.env.example to backend/.env and set a real MongoDB " +
      "connection string, then restart the server.\n"
  );
  process.exit(1);
}

if (!process.env.HF_TOKEN) {
  console.warn(
    "\nWarning: HF_TOKEN is not set. Session/question CRUD will still " +
      "work, but generating questions and AI explanations will fail " +
      "until it's added to backend/.env.\n"
  );
}

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/sessions", sessionRoutes);
app.use("/questions", questionRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HireReady AI backend is running" });
});

// 404 handler — anything that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler — must be defined last, with 4 args, for
// Express to treat it as error middleware. Catches both errors passed via
// next(err) and (in Express 5) rejected promises from async handlers.
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
});

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// AI generation can legitimately take a while (multiple model calls) —
// don't let Node's own default request timeout cut that short.
server.requestTimeout = 180000;
server.headersTimeout = 185000;
