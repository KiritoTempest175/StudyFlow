import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      }}
    >
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* Thank you message */}
        <h2
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '40px',
            textAlign: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Keep Learning! 📚
        </h2>

        <p
          style={{
            fontSize: '32px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.6,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Continue exploring with the interactive chat, quiz, and flashcards
        </p>

        {/* Logo */}
        <div
          style={{
            marginTop: '60px',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)',
          }}
        >
          <span style={{ fontSize: '48px' }}>🎓</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
