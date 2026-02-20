"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Baby, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/app/page";

interface ChatPanelProps {
  messages: Message[];
  loading: boolean;
  onSendMessage: (content: string) => void;
  onELI5: () => void;
}

export default function ChatPanel({
  messages,
  loading,
  onSendMessage,
  onELI5,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedQuestions = [
    "Summarize the main points of this document",
    "What are the key takeaways?",
    "Explain the methodology used",
    "What conclusions were reached?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
              <p className="text-gray-400 text-sm">
                Ask me anything about your document. I&apos;ll provide answers based only on the content you uploaded.
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="w-full max-w-md space-y-2">
              <p className="text-xs text-gray-500 mb-3">Suggested questions:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(question)}
                  className="w-full text-left px-4 py-3 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-lg text-sm transition-all hover:border-primary-500/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-accent-purple to-accent-pink"
                      : "bg-gradient-to-br from-primary-500 to-accent-purple"
                  }`}
                >
                  {message.role === "user" ? "👤" : "🤖"}
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 ${
                    message.role === "user"
                      ? "max-w-[80%]"
                      : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 border border-accent-purple/30"
                        : "bg-dark-card border border-dark-border"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-sm"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {/* Message Actions */}
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-2 ml-2">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="p-1.5 hover:bg-dark-hover rounded transition-colors"
                        title="Copy"
                      >
                        <Copy size={14} className="text-gray-500" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-dark-hover rounded transition-colors"
                        title="Helpful"
                      >
                        <ThumbsUp size={14} className="text-gray-500" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-dark-hover rounded transition-colors"
                        title="Not helpful"
                      >
                        <ThumbsDown size={14} className="text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                  🤖
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-accent-purple rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-accent-pink rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-dark-border p-4 bg-dark-surface">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your document..."
              disabled={loading}
              className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-primary-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-purple rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary-500/30"
            >
              <Send size={16} />
            </button>
          </div>

          {/* ELI5 Button */}
          <button
            type="button"
            onClick={onELI5}
            disabled={messages.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-pink/10 hover:bg-accent-pink/20 border border-accent-pink/30 rounded-lg text-sm font-medium text-accent-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Baby size={16} />
            Explain Like I&apos;m 5
          </button>
        </form>
      </div>
    </div>
  );
}
