"use client";
import { 
  MessageSquare, 
  HelpCircle, 
  Layers, 
  BookOpen, 
  Calculator, 
  Link2 
} from "lucide-react";
import QuizPanel from "./QuizPanel";
import FlashcardsPanel from "./FlashcardsPanel";
import GlossaryPanel from "./GlossaryPanel";
import FormulasPanel from "./FormulasPanel";
import CitationsPanel from "./CitationsPanel";
import { StudyData } from "@/app/page";

interface StudyToolsProps {
  activeTab: "chat" | "quiz" | "flashcards" | "glossary" | "formulas" | "citations";
  onTabChange: (tab: "chat" | "quiz" | "flashcards" | "glossary" | "formulas" | "citations") => void;
  chatPanel: React.ReactNode;
  studyData: StudyData | null;
  onGenerateQuiz: () => void;
  onGenerateFlashcards: () => void;
}

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare, color: "primary" },
  { id: "quiz", label: "Quiz", icon: HelpCircle, color: "accent-purple" },
  { id: "flashcards", label: "Flashcards", icon: Layers, color: "accent-pink" },
  { id: "glossary", label: "Glossary", icon: BookOpen, color: "accent-green" },
  { id: "formulas", label: "Formulas", icon: Calculator, color: "accent-orange" },
  { id: "citations", label: "Citations", icon: Link2, color: "accent-yellow" },
] as const;

export default function StudyTools({
  activeTab,
  onTabChange,
  chatPanel,
  studyData,
  onGenerateQuiz,
  onGenerateFlashcards,
}: StudyToolsProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-dark-border bg-dark-surface overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? `border-${tab.color}-500 text-white`
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
              
              {/* Badge for available content */}
              {tab.id === "quiz" && studyData?.quiz && (
                <span className="badge badge-primary text-xs">
                  {studyData.quiz.length}
                </span>
              )}
              {tab.id === "flashcards" && studyData?.flashcards && (
                <span className="badge badge-primary text-xs">
                  {studyData.flashcards.length}
                </span>
              )}
              {tab.id === "glossary" && studyData?.glossary && (
                <span className="badge badge-success text-xs">
                  {studyData.glossary.length}
                </span>
              )}
              {tab.id === "formulas" && studyData?.formulas && (
                <span className="badge badge-warning text-xs">
                  {studyData.formulas.length}
                </span>
              )}
              {tab.id === "citations" && studyData?.citations && (
                <span className="badge badge-error text-xs">
                  {studyData.citations.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" && chatPanel}
        {activeTab === "quiz" && (
          <QuizPanel 
            quiz={studyData?.quiz || []} 
            onGenerate={onGenerateQuiz}
          />
        )}
        {activeTab === "flashcards" && (
          <FlashcardsPanel 
            flashcards={studyData?.flashcards || []} 
            onGenerate={onGenerateFlashcards}
          />
        )}
        {activeTab === "glossary" && (
          <GlossaryPanel glossary={studyData?.glossary || []} />
        )}
        {activeTab === "formulas" && (
          <FormulasPanel formulas={studyData?.formulas || []} />
        )}
        {activeTab === "citations" && (
          <CitationsPanel citations={studyData?.citations || []} />
        )}
      </div>
    </div>
  );
}
