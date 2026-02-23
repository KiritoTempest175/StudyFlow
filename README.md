<p align="center">
  <img src="https://img.shields.io/badge/StudyFlow-AI%20Study%20Companion-blueviolet?style=for-the-badge&logo=openai&logoColor=white" alt="StudyFlow Banner"/>
</p>

<h1 align="center">📚 StudyFlow — AI Study Companion</h1>

<p align="center">
  Transform dense PDF documents into interactive learning experiences with AI-powered video summaries, quizzes, flashcards, and intelligent chat support.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Remotion-4.0-5B37B7?style=flat-square&logo=remotion&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-fastapi--python)
  - [2. Asset Microservice Setup](#2-asset-microservice-tts--keywords)
  - [3. Video Generation Setup](#3-video-generation-service-remotion)
  - [4. Frontend Setup](#4-frontend-nextjs)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Tech Stack](#-tech-stack)
- [Usage Guide](#-usage-guide)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**StudyFlow** is an AI-powered study companion that converts uploaded PDF documents into a rich, interactive learning environment. It leverages Google's Gemini AI models for intelligent summarization, contextual Q&A, quiz generation, and flashcard creation — while a dedicated video pipeline produces narrated video summaries with synchronized TTS audio and visual imagery.

The application is built as a **microservice architecture** with three independently running services:

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| **Backend API** | `8000` | FastAPI (Python) | Core AI processing, PDF parsing, quiz/flashcard generation |
| **Asset Microservice** | `5000` | FastAPI (Python) | Text-to-Speech audio, keyword extraction, image sourcing |
| **Video Engine** | `3001` | Express + Remotion (Node.js) | MP4 video rendering with audio/image composition |
| **Frontend** | `3000` | Next.js 15 (TypeScript) | User interface and dashboard |

---

## ✨ Features

### 🎯 Core Features
| Feature | Description |
|---------|-------------|
| 📄 **Drag & Drop PDF Upload** | Intuitive file upload with progress tracking and validation |
| 🤖 **AI Summarization** | Instant, structured summaries powered by Google Gemini |
| 💬 **Interactive Chat** | Context-aware Q&A grounded exclusively in your document |
| 🎥 **Automated Video Generation** | Narrated video explanations with TTS audio and visual imagery |
| 📱 **Dual-Pane Dashboard** | Watch videos while chatting simultaneously |
| 🔒 **Privacy First** | No login required; files processed temporarily, never stored permanently |

### 📚 Advanced Study Tools
| Tool | Description |
|------|-------------|
| ✅ **AI Quiz Generator** | Auto-generated multiple-choice questions with explanations and scoring |
| 🎴 **Flashcard Mode** | Digital flip-cards with shuffle and navigation for key terms |
| 📖 **Auto-Glossary** | Automatic extraction and definition of technical terms |
| 🔢 **Formula Extractor** | Mathematical equations highlighted and organized |
| 📚 **Citation Scanner** | References extracted with direct Google Scholar links |
| 👶 **ELI5 Mode** | "Explain Like I'm 5" — simplified explanations with child-friendly analogies |

### 🧠 AI Intelligence
- **Multi-Model Fallback** — Rotates through Gemini 2.5 Flash Lite, 2.5 Flash, 2.0 Flash, and 3.0 Flash
- **Multi-Key Load Balancing** — Supports primary + alternate API keys to avoid rate limits
- **Retry with Exponential Backoff** — Automatic recovery from transient API errors
- **Graceful Degradation** — Fallback placeholders when AI is unavailable

---

## 🏗 Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                             │
│                     http://localhost:3000                          │
└──────────────────────────┬────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 15)                           │
│          TypeScript · Tailwind CSS · Framer Motion               │
│   Components: Upload, Chat, Video, Quiz, Flashcards, etc.       │
└──────────┬────────────────────────────────┬──────────────────────┘
           │                                │
           ▼                                ▼
┌─────────────────────────┐   ┌──────────────────────────────────┐
│   Backend API (:8000)   │   │  Video Generation Engine (:3001) │
│   FastAPI + Gemini AI   │──▶│  Express.js + Remotion 4         │
│                         │   │  Renders MP4 with audio/images   │
│  • PDF Parsing          │   └──────────────────────────────────┘
│  • AI Chat & ELI5       │
│  • Quiz Generation      │
│  • Flashcard Creation   │
│  • Glossary/Formulas    │
│  • Citation Extraction  │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Asset Microservice (:5000)  │
│  FastAPI + gTTS + KeyBERT    │
│                              │
│  • Text-to-Speech Generation │
│  • Keyword Extraction        │
│  • Image Sourcing            │
└──────────────────────────────┘
```

### Video Generation Pipeline

```
PDF Text ──▶ Gemini (Script) ──▶ Asset Service ──▶ Video Engine ──▶ MP4
                                   │                    │
                                   ├─ gTTS Audio        ├─ Remotion Render
                                   ├─ KeyBERT Keywords  ├─ Audio Sync
                                   └─ Image URLs        └─ Image Composition
```

---

## 📂 Project Structure

```
ICAT-2026/
├── start.bat                         # ⚡ One-click launcher (venv + install + run all)
├── backend/                          # Python FastAPI Backend
│   ├── main.py                       # Main API server (port 8000)
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # ⚠️ YOU MUST CREATE THIS (see setup below)
│   ├── core/
│   │   ├── gemini_client.py          # Gemini AI client with multi-model fallback
│   │   ├── file_handler.py           # File processing utilities
│   │   └── models.py                 # Pydantic data models
│   ├── members/
│   │   ├── member1/                  # Chat & ELI5 module
│   │   │   ├── interactive_service.py  # Chat response & ELI5 simplification
│   │   │   └── interactive.py        # Interactive utilities
│   │   ├── member2/                  # Quiz module
│   │   │   ├── quiz_format.py        # AI quiz generation logic
│   │   │   └── tutor_persona.py      # Tutor prompt engineering
│   │   ├── member3/                  # Video & Asset module
│   │   │   ├── service.py            # Asset microservice (port 5000)
│   │   │   ├── script_templates.py   # Video script prompt templates
│   │   │   └── media/               # Generated audio/media files
│   │   └── member5/                  # Document Analysis module
│   │       ├── extractor.py          # Formula & citation extraction
│   │       ├── glossary.py           # Technical term glossary builder
│   │       ├── pacing.py             # Video duration calculator
│   │       ├── analyzer.py           # Text analysis utilities
│   │       └── processor.py          # Document processing pipeline
│   └── storage/                      # Temporary PDF storage
│
├── frontend/                         # Next.js 15 Frontend
│   ├── app/
│   │   ├── page.tsx                  # Main application with state management
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles & dark theme
│   ├── components/
│   │   ├── Header.tsx                # Top navigation bar
│   │   ├── UploadZone.tsx            # Drag & drop PDF upload
│   │   ├── DualPaneLayout.tsx        # Split-view container
│   │   ├── ChatPanel.tsx             # AI chat interface with ELI5
│   │   ├── VideoPlayer.tsx           # Video playback with controls
│   │   ├── StudyTools.tsx            # Tab navigation for study tools
│   │   ├── QuizPanel.tsx             # Interactive quiz system
│   │   ├── FlashcardsPanel.tsx       # Flashcard viewer with flip animation
│   │   ├── GlossaryPanel.tsx         # Searchable term definitions
│   │   ├── FormulasPanel.tsx         # Mathematical formula display
│   │   └── CitationsPanel.tsx        # Reference links with Scholar integration
│   ├── package.json
│   ├── tailwind.config.js            # Custom color theme configuration
│   ├── tsconfig.json
│   └── next.config.js
│
├── video-generation/                 # Remotion Video Engine
│   ├── src/
│   │   ├── server.ts                 # Express API server (port 3001)
│   │   ├── Root.tsx                  # Remotion root composition
│   │   ├── index.ts                  # Entry point
│   │   ├── components/               # Remotion video components
│   │   ├── compositions/             # Video composition definitions
│   │   ├── types/                    # TypeScript type definitions
│   │   └── utils/
│   │       └── generateVideo.ts      # Remotion render pipeline
│   ├── output/                       # Rendered MP4 output directory (git-ignored)
│   ├── remotion.config.ts            # Remotion configuration
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md                         # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Link |
|-------------|---------|------|
| **Python** | 3.10 or higher | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9 or higher | Included with Node.js |
| **Google Gemini API Key** | — | [Get one here](https://aistudio.google.com/apikey) |

### ⚠️ Step 1: Create Your API Key File

This project uses Google Gemini AI. The `.env` file containing API keys is **not included in the repository** for security reasons — you must create it yourself.

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new file called `.env` inside the `backend/` folder
3. Add your key(s):

```env
# backend/.env
GEMINI_API_KEY=your_api_key_here
ALT_KEY=optional_backup_key_here
```

> **Note:** `ALT_KEY` is optional but recommended. The app uses both keys for load-balancing across Gemini's rate limits.

> **⛔ Never commit your `.env` file to Git.** It is already listed in `.gitignore`.

### ⚡ Step 2: One-Click Launch (Windows)

The easiest way to get everything running:

```bash
# 1. Clone the repository
git clone https://github.com/KiritoTempest175/StudyFlow.git
cd StudyFlow

# 2. Create backend/.env with your API key (see Step 1 above)

# 3. Double-click start.bat  (or run from terminal)
start.bat
```

`start.bat` will automatically:
1. Create a Python virtual environment (if one doesn't exist)
2. Install all Python dependencies from `backend/requirements.txt`
3. Install Node.js dependencies for `frontend/` and `video-generation/`
4. Launch **all four services** in separate terminal windows

> After launch, open **http://localhost:3000** in your browser.

### 🔧 Manual Setup (Step-by-Step)

<details>
<summary>Click to expand manual setup instructions</summary>

#### 1. Backend (FastAPI + Python)

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Create backend/.env and add your Gemini API key
# GEMINI_API_KEY=your_key_here

# Start the backend server
cd backend
python main.py
```

> ✅ Backend will be available at **http://127.0.0.1:8000**

#### 2. Asset Microservice (TTS + Keywords)

```bash
# From the project root (same venv)
cd backend
python -m members.member3.service
```

> ✅ Asset service will be available at **http://127.0.0.1:5000**

#### 3. Video Generation Service (Remotion)

```bash
cd video-generation
npm install
npm run server
```

> ✅ Video engine will be available at **http://127.0.0.1:3001**

#### 4. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

> ✅ Frontend will be available at **http://localhost:3000**

</details>

### Service Summary

| Service | Port | Command |
|---------|------|---------|
| Backend API | `8000` | `python main.py` |
| Asset Microservice | `5000` | `python -m members.member3.service` |
| Video Engine | `3001` | `npm run server` |
| Frontend | `3000` | `npm run dev` |

---

## 📡 API Reference

### Backend API (Port 8000)

#### `GET /` — Health Check
```json
{ "status": "AI Study Hub is Running" }
```

#### `POST /upload` — Upload PDF
Uploads a PDF file, extracts text, generates an AI summary, and returns analysis data.

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | `multipart/form-data` | PDF file to upload |

**Response:**
```json
{
  "filename": "document.pdf",
  "summary": "AI-generated summary...",
  "studyData": {
    "quiz": [],
    "flashcards": [],
    "glossary": [{ "term": "...", "definition": "..." }],
    "formulas": ["E = mc²", "..."],
    "citations": [{ "title": "...", "link": "https://scholar.google.com/..." }]
  }
}
```

#### `POST /chat` — Document Chat
Ask questions about the uploaded document.

| Parameter | Type | Description |
|-----------|------|-------------|
| `question` | `string` | Your question about the document |

**ELI5 Triggers:** Include `"like i'm 5"`, `"eli5"`, `"explain it simply"`, or `"simplify this"` in your question for simplified explanations.

**Response:**
```json
{ "answer": "Based on the document..." }
```

#### `POST /generate-quiz` — Generate Quiz
Generates AI-powered multiple-choice questions from the uploaded document.

**Response:**
```json
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 2,
      "explanation": "The correct answer is C because..."
    }
  ]
}
```

#### `POST /generate-flashcards` — Generate Flashcards
Creates study flashcards from the document content.

**Response:**
```json
{
  "cards": [
    { "front": "Key Term", "back": "Definition or explanation" }
  ]
}
```

#### `POST /generate-video` — Generate Video
Triggers the full video generation pipeline (script → audio → render).

**Response:**
```json
{
  "videoUrl": "http://127.0.0.1:3001/videos/video_123.mp4",
  "script": "Generated teaching script...",
  "duration": 120
}
```

---

### Asset Microservice (Port 5000)

#### `POST /generate-video-assets` — Generate Audio & Images
Generates TTS audio and extracts keywords for image sourcing.

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | Script text to process |

**Response:**
```json
{
  "audioUrl": "http://127.0.0.1:5000/media/uuid.mp3",
  "audioDuration": 45.2,
  "images": [
    { "keyword": "education", "url": "https://picsum.photos/1920/1080?random=10" }
  ]
}
```

---

### Video Engine (Port 3001)

#### `POST /generate-video` — Render Video
Renders an MP4 video using Remotion with the provided script, audio, and images.

| Parameter | Type | Description |
|-----------|------|-------------|
| `script` | `string` | Narration script |
| `title` | `string` | Video title |
| `images` | `array` | Array of `{ url, keyword }` objects |
| `audioUrl` | `string` | URL to the TTS audio file |
| `audioDuration` | `number` | Audio duration in seconds |

**Response:**
```json
{
  "success": true,
  "videoUrl": "/videos/video_123456.mp4",
  "message": "Video generated successfully"
}
```

#### `GET /health` — Health Check
```json
{ "status": "ok", "service": "video-generation" }
```

---

## 🔐 Environment Variables

> **⚠️ Important:** The `.env` file is **not included** in the repository. It was intentionally removed and git-ignored to protect API keys.

You must create `backend/.env` manually after cloning:

```env
# backend/.env  — create this file yourself
GEMINI_API_KEY=your_primary_key_here
ALT_KEY=your_optional_backup_key
```

| Variable | Required | Description | How to Get |
|----------|----------|-------------|------------|
| `GEMINI_API_KEY` | ✅ | Primary Google Gemini API key | [Google AI Studio](https://aistudio.google.com/apikey) |
| `ALT_KEY` | ❌ | Alternate key for load balancing (reduces rate-limit errors) | Same link above |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | High-performance Python web framework |
| [Google GenAI SDK](https://pypi.org/project/google-genai/) | `google-genai` — Gemini AI for summarization, chat, quiz, and flashcard generation |
| [PyPDF](https://pypdf.readthedocs.io/) | PDF text extraction |
| [pdfplumber](https://github.com/jsvine/pdfplumber) | Advanced PDF text extraction with header/footer cropping |
| [gTTS](https://gtts.readthedocs.io/) | Google Text-to-Speech audio generation |
| [KeyBERT](https://maartengr.github.io/KeyBERT/) | Keyword extraction using BERT embeddings |
| [TextBlob](https://textblob.readthedocs.io/) | Natural language processing utilities |
| [TextStat](https://pypi.org/project/textstat/) | Text readability analysis |
| [Mutagen](https://mutagen.readthedocs.io/) | MP3 audio duration detection |

### Frontend
| Technology | Purpose |
|-----------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling with custom dark theme |
| [Framer Motion](https://www.framer.com/motion/) | Smooth animations and transitions |
| [Lucide React](https://lucide.dev/) | Modern icon library |
| [React Markdown](https://remarkjs.github.io/react-markdown/) | Markdown rendering for AI responses |

### Video Engine
| Technology | Purpose |
|-----------|---------|
| [Remotion 4](https://remotion.dev/) | Programmatic MP4 video rendering |
| [Express.js](https://expressjs.com/) | HTTP server for video generation API |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe server and component code |

---

## 💡 Usage Guide

### For Students
1. **Upload** your lecture PDF or textbook chapter
2. **Watch** the auto-generated video summary for a quick overview
3. **Chat** with the AI to clarify confusing concepts
4. **Test** yourself with AI-generated quizzes
5. **Review** key terms with flashcards before exams
6. **Explore** formulas, glossary, and citations for deeper understanding

### For Researchers
1. **Upload** academic papers for instant summaries
2. **Extract** key formulas and mathematical equations
3. **Scan** citations with direct Google Scholar links
4. **Build** a glossary of technical terms automatically
5. **Ask** targeted questions via the chat interface

### For Professionals
1. **Upload** technical documentation or reports
2. **Get** a quick video overview of the content
3. **Chat** for specific answers to targeted questions
4. **Extract** important procedures and formulas

---

## 🐛 Troubleshooting

### Backend Issues

| Problem | Solution |
|---------|----------|
| `No Gemini API keys found` | Create `backend/.env` with `GEMINI_API_KEY=your_key` |
| `Module Not Found` errors | Ensure you run `main.py` from the `backend/` directory |
| All AI models return 429 | You've hit rate limits — wait a few minutes or add an `ALT_KEY` |
| PDF extraction returns empty | The PDF may be scanned/image-based (OCR not supported) |

### Frontend Issues

| Problem | Solution |
|---------|----------|
| Styles not loading | Delete `.next/` folder and restart `npm run dev` |
| CORS errors | Verify backend is running on port 8000 with CORS enabled |
| Upload fails | Check backend is running; verify PDF is under 10MB |

### Video Generation Issues

| Problem | Solution |
|---------|----------|
| Audio generation timeout | The asset service (port 5000) may need more time — timeout is set to 10 min |
| Render crashes at 80%+ | Remotion may need more memory — try setting `NODE_OPTIONS=--max-old-space-size=4096` |
| Video has no audio | Verify the asset service is running and returning a valid `audioUrl` |
| Long render times | Video rendering can take 5-30 min depending on script length and system specs |

---

## 🗺 Roadmap

- [ ] Text highlighting in chat responses
- [ ] Audio-only mode for video summaries
- [ ] Export notes to PDF/Markdown
- [ ] Multi-document comparison
- [ ] Collaborative study sessions
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] OCR support for scanned PDFs
- [ ] Custom AI model selection
- [ ] Study session analytics and progress tracking

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it in your own projects.

---

<p align="center">
  <b>Built with ❤️ for students, researchers, and lifelong learners</b>
  <br/>
  <i>Transform your study materials into interactive learning experiences!</i>
</p>
