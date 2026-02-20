"use client";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

interface GlossaryPanelProps {
  glossary: { term: string; definition: string }[];
}

export default function GlossaryPanel({ glossary }: GlossaryPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGlossary = glossary.filter((item) =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (glossary.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-green to-primary-500 flex items-center justify-center">
            <BookOpen size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Auto-Glossary</h3>
          <p className="text-gray-400 mb-6">
            Technical terms and definitions will appear here automatically
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-border p-4 bg-dark-surface">
        <h3 className="font-semibold mb-3">Glossary ({glossary.length} terms)</h3>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Terms List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredGlossary.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No terms found matching &quot;{searchTerm}&quot;
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGlossary.map((item, index) => (
              <div
                key={index}
                className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-accent-green/50 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h4 className="font-semibold text-accent-green mb-2">{item.term}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
