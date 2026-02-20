"use client";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface DualPaneLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function DualPaneLayout({ leftPanel, rightPanel }: DualPaneLayoutProps) {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  return (
    <div className="h-full flex">
      {/* Left Panel - Chat and Study Tools */}
      <div
        className={`transition-all duration-300 border-r border-dark-border flex flex-col bg-dark-surface ${
          leftPanelCollapsed ? "w-0" : "w-1/2"
        }`}
      >
        {!leftPanelCollapsed && leftPanel}
      </div>

      {/* Divider with Toggle */}
      <div className="w-1 bg-dark-border hover:bg-primary-500 transition-colors cursor-col-resize relative group">
        <button
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-dark-card border border-dark-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-hover"
        >
          {leftPanelCollapsed ? (
            <PanelLeftOpen size={16} className="text-gray-400" />
          ) : (
            <PanelLeftClose size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* Right Panel - Video Player */}
      <div className={`flex-1 bg-dark-bg transition-all duration-300`}>
        {rightPanel}
      </div>
    </div>
  );
}
