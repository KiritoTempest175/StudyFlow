# 🎓 AI Study Companion

Transform dense PDF documents into interactive learning experiences with AI-powered video summaries, quizzes, flashcards, and intelligent chat support.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Features
- **📄 Drag & Drop PDF Upload** - Simple, intuitive file upload interface
- **🤖 AI Summarization** - Instant, structured summaries powered by Gemini 2.5 Flash
- **💬 Interactive Chat** - Context-aware Q&A based only on your document
- **🎥 Automated Video Generation** - YouTuber-style narrated explanations with visuals
- **📱 Dual-Pane Dashboard** - Watch videos while chatting simultaneously
- **🔒 Privacy First** - No login required, files processed temporarily only

### 📚 Advanced Study Tools
- **✅ AI Quiz Generator** - Auto-generated multiple-choice questions with explanations
- **🎴 Flashcard Mode** - Digital flip-cards for key terms and concepts
- **📖 Auto-Glossary** - Automatic extraction and definition of technical terms
- **🔢 Formula Extractor** - Mathematical equations highlighted and organized
- **📚 Citation Scanner** - References extracted with Google Scholar links
- **👶 ELI5 Mode** - "Explain Like I'm 5" for simplified explanations

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Backend API running on `http://127.0.0.1:8000`

### Installation

1. **Clone and install:**
```bash
cd ai-study-companion
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:3000
```

## 🏗️ Project Structure

```
ai-study-companion/
├── app/
│   ├── globals.css          # Styles with colorful theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main app with state management
│
├── components/
│   ├── Header.tsx            # Top navigation bar
│   ├── UploadZone.tsx        # Drag & drop upload interface
│   ├── DualPaneLayout.tsx    # Split view container
│   ├── ChatPanel.tsx         # AI chat interface with ELI5
│   ├── VideoPlayer.tsx       # Video playback with controls
│   ├── StudyTools.tsx        # Tab navigation for study features
│   ├── QuizPanel.tsx         # Interactive quiz system
│   ├── FlashcardsPanel.tsx   # Flashcard viewer
│   ├── GlossaryPanel.tsx     # Term definitions
│   ├── FormulasPanel.tsx     # Mathematical formulas
│   └── CitationsPanel.tsx    # Reference links
│
├── package.json
├── tsconfig.json
├── tailwind.config.js        # Colorful theme configuration
└── next.config.js
```

## 🎨 Design Philosophy

### Colorful Yet Professional
- **Gradient accents** - Purple, pink, orange, green for different features
- **Dark theme** - Easy on the eyes during long study sessions
- **Smooth animations** - Polished user experience
- **Clean interface** - Not overwhelming, focused on functionality

### Color Scheme
- **Primary**: Blue tones for main actions
- **Purple**: Quiz and assessment features
- **Pink**: Flashcards and memory tools
- **Green**: Glossary and definitions
- **Orange**: Formulas and calculations
- **Yellow**: Citations and references

## 🔌 Backend Integration

### Required API Endpoints

#### POST /upload
Upload PDF file and get initial summary
```typescript
// Request
FormData with 'file' field (PDF)

// Response
{
  summary: string,
  studyData?: {
    quiz?: QuizQuestion[],
    flashcards?: FlashCard[],
    glossary?: { term: string, definition: string }[],
    formulas?: string[],
    citations?: { title: string, link: string }[]
  }
}
```

#### POST /chat
Send questions about the document
```typescript
// Request
{
  question: string
}

// Response
{
  answer: string
}
```

#### POST /generate-video
Request video generation
```typescript
// Response
{
  videoUrl?: string,
  audioUrl?: string,
  script?: string,
  images?: string[],
  duration?: number
}
```

#### POST /generate-quiz
Generate quiz questions
```typescript
// Response
{
  questions: [{
    question: string,
    options: string[],
    correctAnswer: number,
    explanation?: string
  }]
}
```

#### POST /generate-flashcards
Create flashcards
```typescript
// Response
{
  cards: [{
    front: string,
    back: string
  }]
}
```

### CORS Configuration
```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🎯 Key Features Explained

### 1. Drag & Drop Upload
- Supports PDF files up to 10MB
- Real-time upload progress
- File validation
- Privacy notice displayed

### 2. AI Chat
- Context-aware responses based on document content
- Message history
- Copy, like/dislike actions
- Suggested questions on empty state

### 3. ELI5 Mode
- Special button to simplify last AI response
- Uses child-friendly analogies
- Perfect for complex topics

### 4. Video Player
- Progress bar
- Play/pause controls
- Volume control
- Fullscreen mode
- Script preview

### 5. Quiz System
- Multiple choice questions
- Immediate feedback
- Explanations for answers
- Score tracking
- Progress indicator

### 6. Flashcards
- Flip animation
- Navigate forward/backward
- Shuffle option
- Progress dots

### 7. Study Tools
- Tabbed interface
- Badge counters for available content
- Colorful icons for each tool
- Generate on demand

## 💡 Usage Tips

### For Students
1. Upload lecture PDFs or textbook chapters
2. Watch the video summary first
3. Use chat to clarify confusing points
4. Test yourself with the quiz
5. Review with flashcards before exams

### For Researchers
1. Upload academic papers
2. Get quick summaries of methodology
3. Extract key formulas and equations
4. Check citations and references
5. Use glossary for unfamiliar terms

### For Professionals
1. Upload technical documentation
2. Quick video overview
3. Chat for specific questions
4. Extract important formulas or procedures

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { /* Your blue shades */ },
  accent: {
    purple: '#your-color',
    pink: '#your-color',
    // ...
  }
}
```

### Backend URL
Edit `app/page.tsx`:
```typescript
const API_URL = "http://your-backend-url:port";
```

### Add New Study Tool
1. Create panel component in `components/`
2. Add tab to `StudyTools.tsx`
3. Add state to `page.tsx`
4. Connect to backend endpoint

## 🐛 Troubleshooting

### Upload Fails
- Check backend is running on port 8000
- Verify CORS is enabled
- Ensure file is valid PDF
- Check file size < 10MB

### Video Not Loading
- Check `/generate-video` endpoint
- Verify video URL is accessible
- Check browser console for errors

### Chat Not Working
- Verify `/chat` endpoint responds
- Check request format matches API
- Look for CORS errors

### Styles Not Applying
```bash
rm -rf .next
npm run dev
```

## 📦 Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom theme
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **React Markdown** - Markdown rendering

## 🔐 Privacy & Security

- **No Authentication** - Open access, no accounts needed
- **Temporary Processing** - Files not permanently stored
- **Local Processing** - Data stays in your session
- **No Tracking** - No analytics or user tracking
- **Secure** - HTTPS recommended for production

## 📝 Development Roadmap

- [ ] Add text highlighting in chat responses
- [ ] Implement audio-only mode for videos
- [ ] Add export options for notes
- [ ] Multi-document comparison
- [ ] Collaborative study sessions
- [ ] Mobile app version
- [ ] Offline mode support

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use in your own projects

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Anthropic Claude for development assistance
- Next.js team for the amazing framework
- Tailwind CSS for the utility classes

## 📧 Support

For issues or questions:
- Check the troubleshooting section
- Review backend API documentation
- Check browser console for errors

---

**Built with ❤️ for students, researchers, and lifelong learners**

*Transform your study materials into interactive learning experiences!*
