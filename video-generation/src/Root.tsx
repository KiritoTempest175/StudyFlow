import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './compositions/VideoComposition';
import {
  VIDEO_CONFIG,
  ImageData,
  VideoCompositionProps
} from './types';
import {
  splitScriptIntoSegments,
  calculateTotalDuration,
} from './utils/scriptProcessing';

// Default/mock data for Remotion Studio preview only
const defaultScript = `Artificial Intelligence is transforming education. 
    AI-powered tools can now analyze documents and create personalized learning experiences. 
    Students can get instant summaries of complex materials. 
    Interactive quizzes test understanding in real-time. 
    This technology makes learning more accessible and efficient for everyone.`;

const defaultSegments = splitScriptIntoSegments(defaultScript, VIDEO_CONFIG.FPS, 5);
const defaultContentDuration = calculateTotalDuration(defaultSegments);
const defaultTotalDuration = (VIDEO_CONFIG.FPS * 3) + defaultContentDuration + (VIDEO_CONFIG.FPS * 3);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StudyVideo"
        component={VideoComposition as any}
        durationInFrames={defaultTotalDuration}
        fps={VIDEO_CONFIG.FPS}
        width={VIDEO_CONFIG.WIDTH}
        height={VIDEO_CONFIG.HEIGHT}
        defaultProps={{
          script: defaultScript,
          scriptSegments: defaultSegments,
          images: [
            { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop', keyword: 'technology' },
            { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop', keyword: 'education' },
            { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop', keyword: 'learning' },
          ] as ImageData[],
          audioUrl: undefined,
          title: 'AI Study Companion Demo',
          durationInFrames: defaultTotalDuration,
          fps: VIDEO_CONFIG.FPS,
        }}
        // This is the KEY FIX: dynamically calculate durationInFrames from inputProps
        // so that when generateVideo.ts passes the real audio-synced duration,
        // the composition uses that instead of the hardcoded default above.
        calculateMetadata={async ({ props }) => {
          const p = props as VideoCompositionProps;
          // Use the durationInFrames from inputProps if provided
          if (p.durationInFrames && p.durationInFrames > 0) {
            return {
              durationInFrames: p.durationInFrames,
              fps: VIDEO_CONFIG.FPS,
              width: VIDEO_CONFIG.WIDTH,
              height: VIDEO_CONFIG.HEIGHT,
            };
          }
          // Fallback: calculate from segments
          const contentDur = (p.scriptSegments || []).reduce(
            (total, seg) => total + seg.duration, 0
          );
          const total = (VIDEO_CONFIG.FPS * 3) + contentDur + (VIDEO_CONFIG.FPS * 3);
          return {
            durationInFrames: total,
            fps: VIDEO_CONFIG.FPS,
            width: VIDEO_CONFIG.WIDTH,
            height: VIDEO_CONFIG.HEIGHT,
          };
        }}
      />
    </>
  );
};