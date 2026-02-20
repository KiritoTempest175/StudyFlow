"use client";
import { useState } from "react";
import { Sparkles, RotateCw } from "lucide-react";
import { FlashCard } from "@/app/page";

interface FlashcardsPanelProps {
  flashcards: FlashCard[];
  onGenerate: () => void;
}

export default function FlashcardsPanel({ flashcards, onGenerate }: FlashcardsPanelProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 1. EMPTY STATE
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-pink to-accent-orange flex items-center justify-center">
            <Sparkles size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Flashcards</h3>
          <button onClick={onGenerate} className="px-6 py-3 bg-gradient-to-r from-accent-pink to-accent-orange rounded-lg font-medium hover:scale-105 transition-all">
            Generate Cards
          </button>
        </div>
      </div>
    );
  }

  // 2. SAFETY CHECK
  const card = flashcards[currentCard];
  if (!card) return <div className="p-8 text-center text-gray-500">Loading Cards...</div>;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Uses the .flashcard CSS classes from globals.css */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`flashcard w-full max-w-md ${isFlipped ? "flipped" : ""}`}
      >
        <div className="flashcard-inner">
          {/* FRONT */}
          <div className="flashcard-front">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <h3 className="text-xl font-bold text-white mb-4">{card.front}</h3>
              <p className="text-xs text-accent-pink flex items-center gap-1 absolute bottom-4">
                <RotateCw size={12} /> Click to flip
              </p>
            </div>
          </div>

          {/* BACK */}
          <div className="flashcard-back border-accent-pink">
            <p className="text-lg text-gray-200 leading-relaxed text-center">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-2 mt-8">
        {flashcards.map((_, idx) => (
            <button
                key={idx}
                onClick={() => { setCurrentCard(idx); setIsFlipped(false); }}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentCard ? "bg-accent-pink w-6" : "bg-gray-700"}`}
            />
        ))}
      </div>
    </div>
  );
}