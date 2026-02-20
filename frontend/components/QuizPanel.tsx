"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Sparkles } from "lucide-react";
import { QuizQuestion } from "@/app/page";

interface QuizPanelProps {
  quiz: QuizQuestion[];
  onGenerate: () => void;
}

export default function QuizPanel({ quiz, onGenerate }: QuizPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // 1. EMPTY STATE HANDLING
  if (!quiz || quiz.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
            <Sparkles size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">AI Quiz Generator</h3>
          <button onClick={onGenerate} className="px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg font-medium hover:scale-105 transition-all">
            Generate Quiz
          </button>
        </div>
      </div>
    );
  }

  // 2. CRASH PREVENTION: Check if question exists
  const question = quiz[currentQuestion];
  if (!question) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Loading Question...</p>
            <button onClick={() => setCurrentQuestion(0)} className="text-accent-purple mt-4 underline">Restart</button>
        </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (selectedAnswer === question.correctAnswer) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      <div className="mb-6">
        <span className="text-sm text-accent-purple font-medium">Question {currentQuestion + 1} / {quiz.length}</span>
        <h4 className="text-xl font-semibold mt-2">{question.question}</h4>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === index ? "border-primary-500 bg-primary-500/10" : "border-dark-border bg-dark-card hover:bg-dark-hover"
            } ${showResult && index === question.correctAnswer ? "border-green-500 bg-green-500/10" : ""}
              ${showResult && selectedAnswer === index && index !== question.correctAnswer ? "border-red-500 bg-red-500/10" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        {!showResult ? (
          <button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full py-3 bg-primary-500 rounded-lg font-medium disabled:opacity-50 transition-all">
            Submit Answer
          </button>
        ) : (
          <div className="space-y-4">
             {question.explanation && (
                <div className="p-3 bg-dark-surface rounded border border-dark-border text-sm text-gray-300">
                    <span className="font-bold text-primary-400">Explanation:</span> {question.explanation}
                </div>
             )}
            <button onClick={handleNext} className="w-full py-3 bg-accent-purple rounded-lg font-medium hover:bg-accent-purple/90 transition-all">
                {currentQuestion === quiz.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}