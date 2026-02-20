"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  progress: number;
}

export default function UploadZone({ onFileUpload, loading, progress }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      onFileUpload(files[0]);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8 animate-fade-in">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6">
            <Sparkles size={16} className="text-primary-400" />
            <span className="text-sm text-primary-300 font-medium">Transform PDFs into Interactive Learning</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Upload Your
            <span className="gradient-text"> Study Material</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Get instant video summaries, interactive quizzes, flashcards, and AI-powered chat support
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: "🎥", label: "Video Summary" },
              { icon: "💬", label: "AI Chat" },
              { icon: "📝", label: "Auto Quiz" },
              { icon: "🎴", label: "Flashcards" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-dark-card border border-dark-border rounded-lg p-3 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs text-gray-400">{feature.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            isDragging
              ? "border-primary-500 bg-primary-500/10 scale-105"
              : "border-dark-border bg-dark-card hover:border-primary-500/50 hover:bg-dark-hover"
          }`}
        >
          {loading ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shimmer">
                  <Upload size={32} className="text-white animate-bounce-subtle" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Processing Your Document</h3>
              <p className="text-gray-400 mb-4">This may take a few moments...</p>
              
              {/* Progress Bar */}
              <div className="progress-bar max-w-xs mx-auto">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-primary-400 mt-2">{progress}%</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <FileText size={32} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                Drag & Drop Your PDF Here
              </h3>
              <p className="text-gray-400 mb-6">or click to browse files</p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-purple rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105"
              >
                Choose PDF File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <p className="text-xs text-gray-500 mt-6">
                Supports: Academic papers, textbooks, research documents
              </p>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-dark-card border border-dark-border rounded-lg flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400">🔒</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-200 mb-1">Privacy First</p>
            <p className="text-gray-400">
              Files are processed temporarily for your session only. No data is permanently stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
