// Types for video generation based on project proposal

export interface VideoScript {
  text: string;
  duration: number; // in seconds
  emphasis?: boolean;
}

export interface ScriptSegment {
  id: string;
  text: string;
  startTime: number; // in frames
  duration: number; // in frames
  keywords?: string[];
  emphasis?: boolean;
}

export interface ImageData {
  url: string;
  keyword: string;
  relevanceScore?: number;
}

export interface AudioData {
  url: string;
  duration: number; // in seconds
}

export interface VideoGenerationInput {
  // From Gemini AI
  script: string;
  summary: string;

  // From gTTS
  audioUrl?: string;
  audioDuration?: number;

  // From Unsplash API (via KeyBERT keywords)
  images?: ImageData[];

  // From TextStat (reading difficulty analysis)
  readingLevel?: number; // 1-10 scale
  optimalDuration?: number; // calculated duration in seconds

  // Metadata
  title?: string;
  documentName?: string;
}

export interface VideoCompositionProps {
  script: string;
  scriptSegments: ScriptSegment[];
  images: ImageData[];
  audioUrl?: string;
  title: string;
  durationInFrames: number;
  fps: number;
}

export interface SceneProps {
  segment: ScriptSegment;
  image?: ImageData;
  index: number;
  totalScenes: number;
}

// Constants
export const VIDEO_CONFIG = {
  WIDTH: 1280,
  HEIGHT: 720,
  FPS: 30,
  BACKGROUND_COLOR: '#0a0a0f',

  // Timing
  MIN_SCENE_DURATION: 3, // seconds
  MAX_SCENE_DURATION: 10, // seconds
  TRANSITION_DURATION: 0.5, // seconds

  // Reading speed (words per minute)
  DEFAULT_WPM: 150,
  SIMPLE_WPM: 120, // for complex content
  COMPLEX_WPM: 100, // for very difficult content
} as const;
