import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SceneProps } from '../types';

export const Scene: React.FC<SceneProps> = ({
  segment,
  image,
  index,
  totalScenes,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation (zoom in + fade in)
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const scale = interpolate(entrance, [0, 1], [1.2, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Text animation (slide up)
  const textEntrance = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
    },
  });

  const textY = interpolate(textEntrance, [0, 1], [50, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
      }}
    >
      {/* Background Image with Ken Burns effect */}
      {image && (
        <AbsoluteFill
          style={{
            opacity,
          }}
        >
          <Img
            src={image.url}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${scale})`,
              filter: 'brightness(0.4) blur(2px)',
            }}
          />
          
          {/* Gradient Overlay */}
          <AbsoluteFill
            style={{
              background: 'linear-gradient(180deg, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.95) 100%)',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Content Container */}
      <AbsoluteFill
        style={{
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Text Content */}
        <div
          style={{
            maxWidth: '1200px',
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          <p
            style={{
              fontSize: segment.emphasis ? '72px' : '56px',
              lineHeight: 1.6,
              color: '#ffffff',
              textAlign: 'center',
              fontWeight: segment.emphasis ? 700 : 500,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {segment.text}
          </p>
        </div>

        {/* Progress Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            opacity: 0.5,
          }}
        >
          {Array.from({ length: totalScenes }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === index ? '#3b82f6' : '#ffffff',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
