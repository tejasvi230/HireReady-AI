# AI Interview Preparation Platform

A comprehensive AI-powered interview preparation platform built with React, TypeScript, Node.js, Express, and MongoDB. Features role-based interview sessions, AI-generated questions and answers, accordion learning UI, dynamic AI explanations, and question pinning functionality.

## Features

### 1. Role-Based Interview Sessions
- Create interview sessions tailored to specific job roles
- Select experience level (Entry, Mid, Senior, Expert)
- Choose interview category (Technical, Behavioral, System Design, Coding, Mixed)
- Generate 3-15 questions per session

### 2. AI-Powered Q&A (Gemini API)
- Automatically generate high-quality technical questions
- Get comprehensive answers for each question
- Questions are tailored to job role and experience level
- Smart tagging system for easy categorization

### 3. Accordion Learning UI
- Clean, expandable Q&A interface
- Expand/collapse questions for focused study
- Smooth animations for better UX
- Organized by difficulty and category

### 4. Dynamic AI Explanations
- On-demand concept breakdowns using AI
- Get detailed explanations for any question
- Save explanations for future reference
- Improve understanding with AI-powered insights

### 5. Pinning Important Questions
- Pin questions for quick access
- Dedicated "Pinned" tab for review
- Persistent across sessions
- Easy unpin functionality

### 6. MongoDB Storage
- Save all sessions and questions
- Persistent data storage
- Efficient querying and indexing
- Future review and revision

### 7. Clean UI with Tailwind CSS
- Modern, responsive design
- Dark theme optimized for learning
- Smooth transitions and animations
- Mobile-friendly interface

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Gemini AI API
- CORS enabled
- Morgan (logging)

## Project Structure

```
app/
├── src/                    # Frontend source code
│   ├── App.tsx            # Main application component
│   ├── App.css            # Custom styles
│   └── main.tsx           # Entry point
├── backend/               # Backend source code
│   ├── server.js          # Express server
│   ├── src/
│   │   ├── config/        # Database & Gemini config
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   └── routes/        # API routes
│   └── package.json
├── dist/                  # Built frontend files
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone and Navigate
```bash
cd ai-interview-prep
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Configure Environment Variables
Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_interview_prep
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

### 5. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas connection string.

### 6. Start the Backend Server
```bash
cd backend
npm run dev
```

### 7. Start the Frontend (New Terminal)
```bash
npm run dev
```

### 8. Open in Browser
Navigate to `http://localhost:5173`

## API Endpoints

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get single session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `GET /api/sessions/:id/pinned` - Get pinned questions from session

### Questions
- `GET /api/questions/session/:sessionId` - Get questions for session
- `POST /api/questions/session/:sessionId` - Add question to session
- `GET /api/questions/:id` - Get single question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `PUT /api/questions/:id/pin` - Toggle pin status
- `PUT /api/questions/:id/explanation` - Add AI explanation
- `GET /api/questions/pinned` - Get all pinned questions

### AI
- `POST /api/ai/generate-questions` - Generate questions with AI
- `POST /api/ai/explain` - Generate AI explanation
- `POST /api/ai/improve-answer` - Get answer improvement suggestions

## Usage Guide

### Creating a New Session
1. Click "New Session" or "Generate New" tab
2. Enter session title and job role
3. Select experience level and category
4. Choose number of questions (3-15)
5. Click "Generate with AI"
6. Wait for AI to generate questions

### Studying Questions
1. Click on a session to view questions
2. Click on any question to expand and see the answer
3. Review the answer and tags
4. Click "Get AI Explanation" for deeper understanding

### Pinning Questions
1. Expand a question you want to pin
2. Click the pin icon in the question header
3. Access pinned questions from the "Pinned" tab
4. Click again to unpin

### Managing Sessions
- Click the trash icon to delete a session
- All associated questions will be deleted
- Pinned questions from deleted sessions are also removed

## Customization

### Adding New Categories
Edit the `categories` array in `App.tsx`:
```typescript
const categories = [
  { value: 'your-category', label: 'Your Category', icon: YourIcon },
  // ...
];
```

### Changing AI Model
Edit `backend/src/config/gemini.js`:
```javascript
const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};
```

### Styling
- Tailwind config in `tailwind.config.js`
- Custom styles in `src/App.css`
- Color scheme based on slate/violet/fuchsia

## Production Deployment

### Build Frontend
```bash
npm run build
```

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai_interview_prep
GEMINI_API_KEY=your_production_api_key
NODE_ENV=production
```

### Serve Static Files
The backend can serve the built frontend files from the `dist` folder.

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check firewall settings

### Gemini API Errors
- Verify API key is correct
- Check API quota limits
- Ensure proper request format

### CORS Issues
- Backend CORS is configured for development
- Update CORS settings for production domain

## License

MIT License - feel free to use and modify!

## Contributing

Contributions welcome! Please follow standard Git workflow:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open a GitHub issue or contact the maintainers.

---

Built with ❤️ using React, Node.js, and Google Gemini AI
