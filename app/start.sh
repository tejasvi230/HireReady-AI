#!/bin/bash

echo "=================================="
echo "AI Interview Prep Platform"
echo "=================================="
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check for MongoDB
if ! command_exists mongod; then
    echo "⚠️  MongoDB is not detected. Please make sure MongoDB is running."
    echo "   You can start MongoDB with: mongod --dbpath /path/to/db"
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "   Please create it with the following content:"
    echo ""
    echo "PORT=5000"
    echo "MONGODB_URI=mongodb://localhost:27017/ai_interview_prep"
    echo "GEMINI_API_KEY=your_gemini_api_key_here"
    echo "NODE_ENV=development"
    echo ""
    echo "Get your Gemini API key from: https://makersuite.google.com/app/apikey"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build
echo "✅ Frontend built"
echo ""

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "✅ Backend server started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend development server..."
echo ""
echo "=================================="
echo "🎉 Application is running!"
echo "=================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM EXIT
