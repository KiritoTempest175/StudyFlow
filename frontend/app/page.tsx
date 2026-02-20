"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import DualPaneLayout from "@/components/DualPaneLayout";
import ChatPanel from "@/components/ChatPanel";
import VideoPlayer from "@/components/VideoPlayer";
import StudyTools from "@/components/StudyTools";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface VideoData {
  videoUrl?: string;
  audioUrl?: string;
  script?: string;
  images?: string[];
  duration?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface FlashCard {
  front: string;
  back: string;
}

export interface StudyData {
  summary?: string;
  quiz?: QuizQuestion[];
  flashcards?: FlashCard[];
  glossary?: { term: string; definition: string }[];
  formulas?: string[];
  citations?: { title: string; link: string }[];
}

export default function Home() {
  // Core state
  const [hasDocument, setHasDocument] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Video state
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Study tools state
  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "quiz" | "flashcards" | "glossary" | "formulas" | "citations">("chat");

  // Handle PDF upload
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setUploadProgress(0);
    setDocumentName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      
      setHasDocument(true);
      
      // Set initial summary message
      if (data.summary) {
        setMessages([{
          role: "assistant",
          content: data.summary,
          timestamp: new Date(),
        }]);
      }

      // Set study data
      if (data.studyData) {
        setStudyData(data.studyData);
      }

      // Request video generation
      generateVideo();

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Make sure the backend is running on http://127.0.0.1:8000");
      setHasDocument(false);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Generate video summary
  const generateVideo = async () => {
    setVideoLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-video", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Video generation failed");

      const data = await response.json();
      setVideoData(data);
    } catch (error) {
      console.error("Video generation error:", error);
    } finally {
      setVideoLoading(false);
    }
  };

  // Send chat message
  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "I couldn't process that question.",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle ELI5 mode
  const handleELI5 = async () => {
    if (messages.length === 0) return;

    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (!lastAssistantMessage) return;

    handleSendMessage(
      `Please explain your last answer like I'm 5 years old: "${lastAssistantMessage.content.substring(0, 100)}..."`
    );
  };

  // Generate quiz
  const generateQuiz = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-quiz", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Quiz generation failed");

      const data = await response.json();
      setStudyData((prev) => ({ ...prev, quiz: data.questions }));
      setActiveTab("quiz");
    } catch (error) {
      console.error("Quiz generation error:", error);
    }
  };

  // Generate flashcards
  const generateFlashcards = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-flashcards", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Flashcard generation failed");

      const data = await response.json();
      setStudyData((prev) => ({ ...prev, flashcards: data.cards }));
      setActiveTab("flashcards");
    } catch (error) {
      console.error("Flashcard generation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <Header 
        hasDocument={hasDocument} 
        documentName={documentName}
        onNewDocument={() => {
          setHasDocument(false);
          setDocumentName("");
          setMessages([]);
          setVideoData(null);
          setStudyData(null);
        }}
      />

      {/* Main Content */}
      <main className="h-[calc(100vh-64px)]">
        {!hasDocument ? (
          <UploadZone
            onFileUpload={handleFileUpload}
            loading={loading}
            progress={uploadProgress}
          />
        ) : (
          <DualPaneLayout
            leftPanel={
              <StudyTools
                activeTab={activeTab}
                onTabChange={setActiveTab}
                chatPanel={
                  <ChatPanel
                    messages={messages}
                    loading={chatLoading}
                    onSendMessage={handleSendMessage}
                    onELI5={handleELI5}
                  />
                }
                studyData={studyData}
                onGenerateQuiz={generateQuiz}
                onGenerateFlashcards={generateFlashcards}
              />
            }
            rightPanel={
              <VideoPlayer
                videoData={videoData}
                loading={videoLoading}
              />
            }
          />
        )}
      </main>
    </div>
  );
}
