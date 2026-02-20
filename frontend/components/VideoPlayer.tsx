"use client";
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw } from "lucide-react";
import { useState } from "react";
import { VideoData } from "@/app/page";

interface VideoPlayerProps {
  videoData: VideoData | null;
  loading: boolean;
}

export default function VideoPlayer({ videoData, loading }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shimmer">
              <Play size={40} className="text-white ml-1" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">Generating Your Video</h3>
          <p className="text-gray-400 mb-6">
            AI is creating a personalized video summary with narration and visuals...
          </p>
          
          <div className="space-y-3 text-sm text-left">
            {[
              { label: "Analyzing document", delay: 0 },
              { label: "Generating script", delay: 200 },
              { label: "Creating narration", delay: 400 },
              { label: "Fetching visuals", delay: 600 },
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-slide-in-right"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                <span className="text-gray-400">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
              <Play size={40} className="text-white ml-1" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">Video Summary</h3>
          <p className="text-gray-400 mb-6">
            Upload a document to generate an AI-narrated video summary
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🎙️", label: "AI Narration" },
              { icon: "🖼️", label: "Visual Context" },
              { icon: "⏱️", label: "Smart Pacing" },
              { icon: "📊", label: "Key Points" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-dark-card border border-dark-border rounded-lg p-3"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs text-gray-400">{feature.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1 flex items-center justify-center mb-4">
        {/* Video Container */}
        <div className="w-full max-w-4xl">
          <div className="video-container glow-border">
            {/* Video/Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-card to-dark-bg">
              {videoData.videoUrl ? (
                <video
                  src={videoData.videoUrl}
                  className="w-full h-full object-cover relative z-10"
                  controls
                  autoPlay
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                  <p className="text-gray-400">Video ready to play</p>
                </div>
              )}
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={32} className="text-white ml-1" />
                </div>
              </button>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-3 progress-bar cursor-pointer">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-white" />
                    ) : (
                      <Play size={20} className="text-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                  >
                    {isMuted ? (
                      <VolumeX size={20} className="text-white" />
                    ) : (
                      <Volume2 size={20} className="text-white" />
                    )}
                  </button>

                  <span className="text-sm text-white/80">
                    0:00 / {videoData.duration ? `${Math.floor(videoData.duration / 60)}:${String(videoData.duration % 60).padStart(2, '0')}` : '0:00'}
                  </span>
                </div>

                <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all">
                  <Maximize size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Script/Info Panel */}
      {videoData.script && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Video Script</h4>
            <button className="text-xs text-primary-400 hover:text-primary-300">
              View Full Script
            </button>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {videoData.script.substring(0, 200)}...
          </p>
        </div>
      )}
    </div>
  );
}
