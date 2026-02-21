import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
} from 'remotion';
import { Scene } from '../components/Scene';
import { TitleCard } from '../components/TitleCard';
import { OutroCard } from '../components/OutroCard';
import { VideoCompositionProps } from '../types';

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  script,
  scriptSegments,
  images,
  audioUrl,
  title,
}) => {
  const { fps } = useVideoConfig();

  // Title card duration (3 seconds)
  const titleDuration = fps * 3;

  // Outro card duration (3 seconds)
  const outroDuration = fps * 3;

  // Calculate total content duration
  const contentDuration = scriptSegments.reduce(
    (total, segment) => total + segment.duration,
    0
  );

  return (
    <AbsoluteFill>
      {/* Background Audio — starts after title card, spans only the content scenes */}
      {audioUrl && (
        <Sequence from={titleDuration} durationInFrames={contentDuration}>
          <Audio src={audioUrl} volume={1} />
        </Sequence>
      )}

      {/* Title Card */}
      <Sequence durationInFrames={titleDuration}>
        <TitleCard
          title={title}
          subtitle="AI-Generated Video Summary"
        />
      </Sequence>

      {/* Content Scenes */}
      {scriptSegments.map((segment, index) => {
        const image = images.find(img =>
          segment.keywords?.some(keyword =>
            img.keyword?.toLowerCase().includes(keyword.toLowerCase())
          )
        ) || images[index % images.length];

        return (
          <Sequence
            key={segment.id}
            from={titleDuration + segment.startTime}
            durationInFrames={segment.duration}
          >
            <Scene
              segment={segment}
              image={image}
              index={index}
              totalScenes={scriptSegments.length}
            />
          </Sequence>
        );
      })}

      {/* Outro Card */}
      <Sequence
        from={titleDuration + contentDuration}
        durationInFrames={outroDuration}
      >
        <OutroCard />
      </Sequence>
    </AbsoluteFill>
  );
};
