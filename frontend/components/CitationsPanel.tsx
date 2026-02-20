"use client";
import { ExternalLink, Search, Copy } from "lucide-react";

interface CitationsPanelProps {
  citations: { title: string; link: string }[];
}

export default function CitationsPanel({ citations }: CitationsPanelProps) {
  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  if (citations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-yellow to-accent-pink flex items-center justify-center">
            <Search size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Citations Scanner</h3>
          <p className="text-gray-400 mb-6">
            References and citations will be extracted with Google Scholar links
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-border p-4 bg-dark-surface">
        <h3 className="font-semibold">Citations ({citations.length})</h3>
        <p className="text-xs text-gray-400 mt-1">Extracted references with verification links</p>
      </div>

      {/* Citations List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {citations.map((citation, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-lg p-4 group hover:border-accent-yellow/50 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-yellow/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-accent-yellow font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 mb-2 leading-relaxed">{citation.title}</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={citation.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-accent-yellow hover:text-accent-yellow/80 transition-colors"
                    >
                      <ExternalLink size={12} />
                      View on Google Scholar
                    </a>
                    <button
                      onClick={() => copyLink(citation.link)}
                      className="p-1 hover:bg-dark-hover rounded opacity-0 group-hover:opacity-100 transition-all"
                      title="Copy link"
                    >
                      <Copy size={12} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
