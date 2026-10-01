# HireReady AI

**An AI-powered interview preparation platform built with the MERN stack and TypeScript.**

HireReady helps students, job seekers, and professionals practice for interviews
with questions tailored to a job role, experience level, and interview category.
Users can generate interview questions with reference answers, request AI coaching,
pin useful questions, and revisit saved preparation sessions.

## What the project does

Instead of maintaining a fixed list of interview questions, HireReady sends the
user's interview requirements to a hosted language model through Hugging Face
Inference Providers. The backend validates the generated questions and saves them
in MongoDB. The React frontend provides a workspace for reviewing answers,
requesting explanations, and organizing questions for revision.

For example, a user can create a session titled **React Interview Preparation**,
enter **Frontend Engineer** as the role, choose **Entry** experience and
**Technical** questions, and generate a question set for that combination.

The application includes a public landing page and an interview studio with
**Generate interview**, **Saved sessions**, and **Pinned questions** sections.

## Features

| Feature                          | What users can do                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Personalized question generation | Generate questions using a custom job role, experience level, and interview category.                                                          |
| Named interview sessions         | Give each preparation session a title and keep its requirements together.                                                                      |
| Interview question sets          | Request 30 questions per generation attempt; valid partial results are saved if the provider returns fewer questions or fails partway through. |
| Reference answers                | Expand a question to read its generated answer.                                                                                                |
| Difficulty labels                | View questions marked easy, medium, hard, or expert.                                                                                           |
| Topic tags                       | View tags associated with each question.                                                                                                       |
| AI explanations                  | Request coaching on key points, common mistakes, and trade-offs for a question; regenerate an explanation when needed.                         |
| Saved explanations               | Reopen a question later with its previously saved explanation.                                                                                 |
| Question pinning                 | Pin or unpin important questions and review them across sessions in one place.                                                                 |
| Saved sessions                   | Revisit sessions with their role, experience level, question count, and creation date.                                                         |
| Question and session deletion    | Delete an individual question or a session after a confirmation prompt.                                                                        |
| Failed-generation recovery       | Retry generation within a saved session that has no questions, using the original inputs.                                                      |
| Responsive interface             | Use the dark-themed interface on desktop and smaller screens, with a collapsible mobile sidebar and navigation menu.                           |
| Loading and error feedback       | See progress indicators, error banners, empty states, and partial-generation notices.                                                          |
| Input validation                 | Require a nonblank session title and job role; restrict the title to 100 characters and the job-role input to 200 characters in the frontend.  |

### Experience levels

| Level  | Experience shown in the interface |
| ------ | --------------------------------- |
| Entry  | 0–2 years                         |
| Mid    | 2–5 years                         |
| Senior | 5–8 years                         |
| Expert | 8+ years                          |

### Interview categories

| Category      | Focus                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Technical     | Technical concepts and knowledge relevant to the role.                       |
| Behavioral    | Communication, teamwork, and workplace situations.                           |
| System Design | Architecture, scalability, and design trade-offs.                            |
| Coding        | Programming and problem-solving questions.                                   |
| Mixed         | A combination of technical, behavioral, coding, and system-design questions. |

### Backend reliability features

- Generate questions in small batches of five to reduce response truncation.
- Validate question and answer fields before saving generated items.
- Remove duplicate question text within a generation request.
- Request additional batches when malformed or duplicate items leave missing questions.
- Parse JSON arrays returned directly, inside markdown, or inside a `questions` object.
- Recover complete question objects when the final object in a response is truncated.
- Use a fallback model for supported model/provider availability failures.
- Apply time limits to AI calls and the overall generation operation.
- Reject simultaneous generation requests for the same session within one backend process.
- Report token-permission, credit, rate-limit, timeout, and provider errors.
- Validate MongoDB IDs before looking up a session or question.
- Load environment configuration relative to the backend server file.

## Tech stack

### Frontend

| Technology       | Version / role                                                                |
| ---------------- | ----------------------------------------------------------------------------- |
| React            | 19 — component-based interface, state, and effects.                           |
| React DOM        | 19 — renders the React application in the browser.                            |
| TypeScript       | Typed frontend source files and shared interfaces for questions and sessions. |
| Vite             | 8 — development server, backend proxy, and production bundling.               |
| React Router DOM | 7 — landing/studio routes and URL-based tab/session navigation.               |
| Tailwind CSS     | 4 — responsive layout, colors, typography, and component styling.             |
| Axios            | 1 — frontend HTTP requests and API error handling.                            |
| Lucide React     | 0.575 — icons for navigation, questions, pins, and actions.                   |
| HTML and CSS     | Page structure, global styles, and visual presentation.                       |

### Backend, database, and AI

| Technology                       | Version / role                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| Node.js                          | JavaScript runtime for the API; use a version compatible with the project's Vite dependencies. |
| JavaScript / CommonJS            | Backend services, controllers, models, and route handlers.                                     |
| Express                          | 5 — REST API routes, middleware, and error handling.                                           |
| MongoDB                          | Document database for sessions, questions, pins, and explanations.                             |
| Mongoose                         | 9 — schemas, validation, document references, population, and database queries.                |
| Hugging Face Inference Providers | Hosted language-model inference for question and explanation generation.                       |
| `@huggingface/inference`         | 4 — SDK used to send chat-completion requests to Hugging Face.                                 |
| CORS                             | 2 — cross-origin request middleware.                                                           |
| dotenv                           | 17 — loads backend environment variables.                                                      |
| Morgan                           | 1 — HTTP request logging.                                                                      |
| REST / JSON                      | Communication between the frontend and backend.                                                |

### AI models

| Setting            | Default                             |
| ------------------ | ----------------------------------- |
| Main model         | `meta-llama/Llama-3.3-70B-Instruct` |
| Fallback model     | `meta-llama/Llama-3.1-8B-Instruct`  |
| Provider selection | `auto`                              |

These settings can be changed in `backend/.env`. The app uses hosted models;
it does not require downloading model weights or training a model locally.

### Development and supporting tools

| Tool                                         | Purpose                                      |
| -------------------------------------------- | -------------------------------------------- |
| npm                                          | Dependency installation and project scripts. |
| Nodemon 3                                    | Restarts the backend during development.     |
| PostCSS 8 and `@tailwindcss/postcss` 4       | CSS processing and Tailwind integration.     |
| `@vitejs/plugin-react` 6                     | React support in Vite.                       |
| ESLint 9 and `@eslint/js` 9                  | JavaScript lint configuration.               |
| `eslint-plugin-react-hooks` 7                | React Hooks lint rules.                      |
| `eslint-plugin-react-refresh` 0.4            | React Fast Refresh lint rules.               |
| `globals` 16                                 | Browser-global definitions for linting.      |
| `@types/react` and `@types/react-dom` 19     | Type definitions for React source files.     |
| Node.js `node:test` and `node:assert/strict` | Backend tests and assertions.                |

**Additional declared dependencies:** Framer Motion 12 is included in the
frontend package manifest but is not currently imported by the application.
Axios is also declared in the backend manifest; the current AI service uses the
Hugging Face SDK rather than backend Axios calls.

## How the application works

1. The user enters a title and job role, then chooses an experience level and category.
2. The frontend creates a session through the Express API.
3. The backend builds a prompt from that session's requirements and requests AI questions in batches.
4. Generated items are parsed, checked, deduplicated, and linked to the session.
5. MongoDB stores the questions and session references.
6. The frontend opens the saved session so the user can review answers and tags.
7. Pinning and AI explanations update the stored question documents for later revision.

## Project structure

Place this README in `hireready/app`, alongside the two application folders.

| Path                       | Contents                                                                         |
| -------------------------- | -------------------------------------------------------------------------------- |
| `backend/server.js`        | API setup, middleware, database connection, and health check.                    |
| `backend/src/controllers/` | Question-generation request handling.                                            |
| `backend/src/services/`    | AI prompts, model calls, failover, and response parsing.                         |
| `backend/src/models/`      | Mongoose session and question schemas; a user-model placeholder is also present. |
| `backend/src/routes/`      | Session and question API endpoints.                                              |
| `backend/test/`            | AI-service and generation-flow tests.                                            |
| `backend/.env.example`     | Example backend configuration.                                                   |
| `frontend/src/pages/`      | Landing page and interview dashboard.                                            |
| `frontend/src/components/` | Navigation, forms, cards, buttons, banners, and dialogs.                         |
| `frontend/src/lib/`        | API client, category/experience constants, and utilities.                        |
| `frontend/src/types.ts`    | Shared frontend data interfaces.                                                 |
| `frontend/vite.config.ts`  | Vite configuration and development API proxy.                                    |
| `frontend/.env.example`    | Example deployed-backend URL configuration.                                      |

## Run locally

### Prerequisites

- Node.js **22.12+ or a compatible newer release**; Node.js 24 is suitable.
- npm.
- A running local MongoDB instance or a MongoDB Atlas connection string.
- A Hugging Face access token with **Make calls to Inference Providers** permission.
- Available inference credits and internet access for AI generation.

### 1. Start the backend

From `hireready/app`:

```bash
cd backend
npm install
```

If `.env` is not already present, create it from the example.

Windows Command Prompt / PowerShell:

```powershell
copy .env.example .env
```

macOS / Linux:

```bash
cp .env.example .env
```

Edit `backend/.env` using your own connection string and token:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hireready
HF_TOKEN=your_huggingface_token
HF_MODEL=meta-llama/Llama-3.3-70B-Instruct
HF_PROVIDER=auto
HF_FALLBACK_MODEL=meta-llama/Llama-3.1-8B-Instruct
```

If using Atlas, replace the local `MONGODB_URI` with your cluster connection string.
If the fixed project already contains your configured `.env`, retain it.

Start the API:

```bash
npm run dev
```

The default backend URL is **http://localhost:5000**. Visiting `/` returns a
JSON health response. Restart the backend after changing environment variables.

### 2. Start the frontend

Open a second terminal from `hireready/app`:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally **http://localhost:5173**.
The development server forwards `/api/*` requests to `http://localhost:5000/*`.
If you change the backend port, update the proxy target in `frontend/vite.config.ts`.

### Environment variables

| Variable            | Location | Purpose                                    |
| ------------------- | -------- | ------------------------------------------ |
| `PORT`              | Backend  | API port; defaults to 5000.                |
| `MONGODB_URI`       | Backend  | MongoDB connection string.                 |
| `HF_TOKEN`          | Backend  | Hugging Face inference access token.       |
| `HF_MODEL`          | Backend  | Primary AI model.                          |
| `HF_PROVIDER`       | Backend  | Provider selection; defaults to `auto`.    |
| `HF_FALLBACK_MODEL` | Backend  | Alternate model for availability failures. |
| `VITE_API_URL`      | Frontend | Backend base URL for deployed builds.      |

For a deployed frontend, copy `frontend/.env.example` to `frontend/.env` and set
`VITE_API_URL` to the deployed backend URL before building. The development proxy
is not available in a deployed static build. Do not place `HF_TOKEN` or database
credentials in frontend environment variables.

## Available commands

### Backend

| Command       | Purpose                      |
| ------------- | ---------------------------- |
| `npm run dev` | Run the server with Nodemon. |
| `npm start`   | Run the server with Node.js. |
| `npm test`    | Run the backend test suite.  |

### Frontend

| Command           | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite development server.               |
| `npm run build`   | Create the production frontend build in `dist/`. |
| `npm run preview` | Preview the production build locally.            |
| `npm run lint`    | Run the existing ESLint configuration.           |

## API endpoints

The backend uses the following paths directly. In local frontend development,
requests use the `/api` proxy prefix, which Vite removes before forwarding them.

| Method | Endpoint                 | Purpose                                             |
| ------ | ------------------------ | --------------------------------------------------- |
| GET    | `/`                      | Backend health response.                            |
| POST   | `/sessions`              | Create a session.                                   |
| GET    | `/sessions`              | List sessions.                                      |
| GET    | `/sessions/pinned/all`   | List sessions marked as pinned through the API.     |
| GET    | `/sessions/:id`          | Load a session with populated questions.            |
| PUT    | `/sessions/:id`          | Update session fields through the API.              |
| DELETE | `/sessions/:id`          | Delete a session document.                          |
| POST   | `/sessions/:id/generate` | Generate and save questions for a session.          |
| GET    | `/questions`             | List questions with their session information.      |
| GET    | `/questions/pinned/all`  | List pinned questions.                              |
| GET    | `/questions/:id`         | Load a question.                                    |
| PUT    | `/questions/:id/pin`     | Toggle pinning or set an explicit `isPinned` value. |
| POST   | `/questions/:id/explain` | Generate and save AI coaching for a question.       |
| DELETE | `/questions/:id`         | Delete a question document.                         |

Session editing and session pinning are backend capabilities; the current
frontend provides question pinning rather than a session-pin control.

## Data stored

| Document | Main fields                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Session  | Title, job role, experience level, category, question references, active/pinned flags, and creation/update timestamps. |
| Question | Session reference, question text, answer, category, difficulty, tags, pinned flag, AI explanation, and timestamps.     |

Mongoose references associate questions with a session, and population lets the
session-detail endpoint return full question documents. Question indexes support
queries by session, pinned state, and category.

## Testing

The backend includes **20 tests** covering response parsing, truncated-response
recovery, model failover, missing tokens, provider/account errors, question
validation, deduplication, partial results, session creation and reloading,
failed-generation retries, and concurrent-generation protection.

```bash
cd backend
npm test
```

These tests use mocked AI responses and in-memory model stubs. They do not modify
a live MongoDB database or consume Hugging Face inference credits.
