import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface TransitionProps {
  type?: 'fade' | 'slide' | 'zoom';
}

export const Transition: React.FC<TransitionProps> = ({ type = 'fade' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        opacity: type === 'fade' ? 1 - opacity : 0,
      }}
    />
  );
};
