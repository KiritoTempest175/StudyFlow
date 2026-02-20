"use client";
import { GraduationCap, FileText, Plus } from "lucide-react";

interface HeaderProps {
  hasDocument: boolean;
  documentName: string;
  onNewDocument: () => void;
}

export default function Header({ hasDocument, documentName, onNewDocument }: HeaderProps) {
  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-accent-purple to-accent-pink flex items-center justify-center shadow-lg shadow-primary-500/30">
          <GraduationCap size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text">AI Study Companion</h1>
          {hasDocument && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FileText size={12} />
              <span className="truncate max-w-xs">{documentName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {hasDocument && (
          <button
            onClick={onNewDocument}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/30"
          >
            <Plus size={16} />
            New Document
          </button>
        )}
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-card rounded-lg border border-dark-border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400">No Login Required</span>
        </div>
      </div>
    </header>
  );
}
