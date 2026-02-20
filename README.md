AI Study Companion

Overview

AI Study Companion is a full-stack, microservice-based web application that transforms uploaded PDF documents into interactive learning modules. It features automated summarization, interactive AI chat, quiz generation, flashcards, and programmatic MP4 video rendering with synchronized Text-to-Speech (TTS) and dynamic visual assets.

System Architecture

The application is highly decoupled and operates across four distinct services:

Frontend (Port 3000): A Next.js application handling the user interface, state management, and video playback.

Main Backend (Port 8000): A FastAPI server (main.py) orchestrating PDF parsing, Gemini AI prompt generation, and task delegation.

Video Engine (Port 3001): A Node.js/Express server (server.ts) running @remotion/renderer to bundle and render 720p MP4 videos programmatically.

Asset Microservice (Port 5000): A FastAPI server (service.py) utilizing KeyBERT for keyword extraction and gTTS for audio synthesis.

Features

Document Processing: PDF text extraction, glossary building, formula extraction, and citation parsing.

AI Chat: Interactive chat with document context and an ELI5 (Explain Like I'm 5) simplification mode.

Study Tools: Automated generation of multiple-choice quizzes and flashcards.

Video Generation: Automated script generation, text-to-speech audio synthesis, and Remotion-based MP4 rendering with smart pacing and dynamic images.

Load Balancing: Dynamic model rotation across Gemini 2.5 Flash and Flash Lite to manage API rate limits.

Prerequisites

Node.js (v18+)

Python (3.10+)

FFmpeg (Required by Remotion for MP4 encoding)

Minimum 8GB RAM (Required for KeyBERT and Remotion rendering)

Environment Variables

Create a .env file in the backend directory with the following variables:

GEMINI_API_KEY=your_primary_google_api_key
ALT_KEY=your_secondary_google_api_key


Local Development Setup

Because of the microservice architecture, four separate terminal sessions must be run concurrently.

1. Main Backend

cd backend
pip install fastapi uvicorn pypdf pydantic google-generativeai python-dotenv requests
python main.py


2. Asset Microservice

cd backend/members/member3
pip install fastapi uvicorn pydantic keybert gtts
python service.py


3. Video Engine

cd video-generation
npm install
npm run server


4. Frontend

cd frontend
npm install
npm run dev


Production Deployment (VPS / PM2)

Deploying this application requires a Virtual Private Server (VPS) with at least 8GB RAM. Cloud functions or serverless environments (e.g., Vercel) are insufficient due to memory constraints and execution timeouts.

Install PM2 globally:

npm install -g pm2


Build the frontend:

cd frontend
npm run build


Create an ecosystem.config.js file in the project root:

module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "./frontend",
      script: "npm",
      args: "start",
      env: { PORT: 3000 }
    },
    {
      name: "main-backend",
      cwd: "./backend",
      script: "python",
      args: "main.py",
      interpreter: "python3"
    },
    {
      name: "video-engine",
      cwd: "./video-generation",
      script: "npm",
      args: "run server"
    },
    {
      name: "audio-service",
      cwd: "./backend/members/member3",
      script: "python",
      args: "service.py",
      interpreter: "python3"
    }
  ]
}
