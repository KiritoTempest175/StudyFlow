import { ScriptSegment, VIDEO_CONFIG } from '../types';

/**
 * Split script into segments based on sentences
 * Each segment will become a scene in the video
 */
export function splitScriptIntoSegments(
  script: string,
  fps: number,
  readingLevel?: number
): ScriptSegment[] {
  // Split by sentences (simple approach)
  const sentences = script
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Calculate words per minute based on reading difficulty
  const wpm = calculateWPM(readingLevel);

  const segments: ScriptSegment[] = [];
  let currentFrame = 0;

  sentences.forEach((text, index) => {
    const wordCount = text.split(/\s+/).length;

    // Calculate duration based on reading speed (WPM)
    // Formula: (WordCount / WPM) * 60 seconds
    const rawDurationInSeconds = (wordCount / wpm) * 60;

    // Only enforce a minimum duration (no max cap — audio drives the real timing)
    const durationInSeconds = Math.max(
      VIDEO_CONFIG.MIN_SCENE_DURATION || 3,
      rawDurationInSeconds
    );

    const durationInFrames = Math.ceil(durationInSeconds * fps);

    segments.push({
      id: `segment-${index}`,
      text,
      startTime: currentFrame,
      duration: durationInFrames,
      keywords: extractKeywords(text),
      emphasis: index % 2 === 0, // Alternate emphasis for visual variety
    });

    currentFrame += durationInFrames;
  });

  return segments;
}

/**
 * Rescale all segment durations so their total matches the actual audio duration.
 * This ensures visual scenes stay in sync with the gTTS narration.
 */
export function rescaleSegmentsToAudioDuration(
  segments: ScriptSegment[],
  audioDurationSeconds: number,
  fps: number
): ScriptSegment[] {
  if (segments.length === 0 || audioDurationSeconds <= 0) return segments;

  const targetTotalFrames = Math.ceil(audioDurationSeconds * fps);
  const currentTotalFrames = segments.reduce((sum, s) => sum + s.duration, 0);

  if (currentTotalFrames <= 0) return segments;

  const scaleFactor = targetTotalFrames / currentTotalFrames;

  let currentFrame = 0;
  const rescaled = segments.map((segment) => {
    const newDuration = Math.max(1, Math.round(segment.duration * scaleFactor));
    const newSegment: ScriptSegment = {
      ...segment,
      startTime: currentFrame,
      duration: newDuration,
    };
    currentFrame += newDuration;
    return newSegment;
  });

  // Fix any rounding error on the last segment so total exactly matches
  const actualTotal = rescaled.reduce((sum, s) => sum + s.duration, 0);
  const diff = targetTotalFrames - actualTotal;
  if (rescaled.length > 0 && diff !== 0) {
    rescaled[rescaled.length - 1].duration += diff;
  }

  return rescaled;
}

function calculateWPM(readingLevel?: number): number {
  // Match gTTS speaking rate (~150 WPM)
  const DEFAULT_WPM = 150;
  const SIMPLE_WPM = 130;
  const COMPLEX_WPM = 110;

  if (!readingLevel) return DEFAULT_WPM;

  // Higher reading level = slower pace needed
  if (readingLevel >= 8) return COMPLEX_WPM;
  if (readingLevel >= 5) return SIMPLE_WPM;
  return DEFAULT_WPM;
}

/**
 * Extract potential keywords from text
 * Simple implementation - removes common words and finds unique nouns/verbs
 */
function extractKeywords(text: string): string[] {
  // List of common stop words to ignore
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'it', 'its', 'we', 'they', 'them', 'their', 'our', 'you', 'your'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  // Return top 3 unique words
  return Array.from(new Set(words)).slice(0, 3);
}

/**
 * Calculate total video duration in frames
 */
export function calculateTotalDuration(segments: ScriptSegment[]): number {
  return segments.reduce((total, segment) => total + segment.duration, 0);
}

/**
 * Match images to script segments based on keywords
 * (Optional helper for future backend integration)
 */
export function matchImagesToSegments(
  segments: ScriptSegment[],
  images: any[]
): Map<string, any> {
  const imageMap = new Map();

  segments.forEach(segment => {
    // Find best matching image based on keywords
    const bestImage = findBestMatchingImage(segment.keywords || [], images);
    if (bestImage) {
      imageMap.set(segment.id, bestImage);
    }
  });

  return imageMap;
}

/**
 * Helper to find best image match
 */
function findBestMatchingImage(keywords: string[], images: any[]): any {
  if (!images || images.length === 0) return null;

  // 1. Try to find exact keyword match
  for (const keyword of keywords) {
    const match = images.find(img =>
      img.keyword?.toLowerCase().includes(keyword.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Fallback: Return a random image if no keyword matches
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Format time for display (MM:SS)
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}