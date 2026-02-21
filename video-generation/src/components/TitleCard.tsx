import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface TitleCardProps {
  title: string;
  subtitle?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Title animation
  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 100,
    },
  });

  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // Subtitle animation
  const subtitleSpring = spring({
    frame: frame - 25,
    fps,
    config: {
      damping: 100,
    },
  });

  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      }}
    >
      {/* Animated Background Particles */}
      <AbsoluteFill
        style={{
          opacity: 0.1,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)',
          }}
        >
          <span style={{ fontSize: '64px' }}>🎓</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '96px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '20px',
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            textAlign: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: '32px',
              color: '#9ca3af',
              opacity: subtitleOpacity,
              textAlign: 'center',
              maxWidth: '800px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Powered by AI badge */}
        <div
          style={{
            marginTop: '60px',
            padding: '12px 24px',
            borderRadius: '100px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            opacity: subtitleOpacity,
          }}
        >
          <p
            style={{
              fontSize: '18px',
              color: '#3b82f6',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            ✨ Powered by AI
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
