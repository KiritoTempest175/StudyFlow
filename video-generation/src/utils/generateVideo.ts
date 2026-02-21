import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { VideoGenerationInput } from '../types';
import { splitScriptIntoSegments, rescaleSegmentsToAudioDuration, calculateTotalDuration } from '../utils/scriptProcessing';
import path from 'path';

const VIDEO_CONFIG = {
  WIDTH: 1280,   // Lowered from 1920 to save memory
  HEIGHT: 720,   // Lowered from 1080 to save memory
  FPS: 30,
};

/**
 * Main function to generate video from backend
 * This is what your FastAPI backend will call
 */
export async function generateVideo(
  input: VideoGenerationInput,
  outputPath: string
): Promise<{ success: boolean; videoPath?: string; error?: string }> {
  try {
    console.log('Starting video generation...');
    console.log('Input:', {
      scriptLength: input.script.length,
      imageCount: input.images?.length,
      hasAudio: !!input.audioUrl,
      audioDuration: input.audioDuration,
    });

    // Step 1: Process script into segments
    let scriptSegments = splitScriptIntoSegments(
      input.script,
      VIDEO_CONFIG.FPS,
      input.readingLevel
    );

    // Step 2: If we have a real audio duration, rescale segments to match it exactly
    if (input.audioDuration && input.audioDuration > 0) {
      console.log(`Rescaling segments to match audio duration: ${input.audioDuration}s`);
      scriptSegments = rescaleSegmentsToAudioDuration(
        scriptSegments,
        input.audioDuration,
        VIDEO_CONFIG.FPS
      );
    }

    // Step 3: Calculate total duration
    const titleDuration = VIDEO_CONFIG.FPS * 3;
    const outroDuration = VIDEO_CONFIG.FPS * 3;
    const contentDuration = calculateTotalDuration(scriptSegments);
    const totalDuration = titleDuration + contentDuration + outroDuration;

    console.log('Video duration:', {
      title: '3s',
      content: `${Math.floor(contentDuration / VIDEO_CONFIG.FPS)}s`,
      outro: '3s',
      total: `${Math.floor(totalDuration / VIDEO_CONFIG.FPS)}s`,
    });

    // Step 4: Bundle the Remotion project
    console.log('Bundling Remotion project...');
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, '../index.ts'),
      webpackOverride: (config) => config,
    });

    console.log('Bundle created at:', bundleLocation);

    // Step 5: Select the composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'StudyVideo',
      inputProps: {
        script: input.script,
        scriptSegments,
        images: input.images || [],
        audioUrl: input.audioUrl,
        title: input.title || input.documentName || 'Study Summary',
        durationInFrames: totalDuration,
        fps: VIDEO_CONFIG.FPS,
      },
    });

    console.log('Composition selected:', composition.id);

    // Step 6: Render the video (with memory-saving options)
    console.log('Rendering video at 720p with memory optimizations...');
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        script: input.script,
        scriptSegments,
        images: input.images || [],
        audioUrl: input.audioUrl,
        title: input.title || input.documentName || 'Study Summary',
        durationInFrames: totalDuration,
        fps: VIDEO_CONFIG.FPS,
      },
      // --- Memory optimization flags ---
      concurrency: 1,           // Render 1 frame at a time to minimize RAM usage
      imageFormat: 'jpeg',      // JPEG frames use far less memory than PNG
      jpegQuality: 80,          // Good quality at lower memory cost
      timeoutInMilliseconds: 120000, // 2 min per-frame timeout (prevents hangs on complex frames)
      chromiumOptions: {
        disableWebSecurity: true,
        gl: 'angle',            // Use ANGLE for more stable GPU rendering on Windows
      },
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log('Video generated successfully at:', outputPath);

    return {
      success: true,
      videoPath: outputPath,
    };
  } catch (error) {
    console.error('Video generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Example usage from Node.js/FastAPI:
 * 
 * const result = await generateVideo(
 *   {
 *     script: "Your AI-generated script here...",
 *     summary: "Document summary",
 *     title: "Video Title",
 *     images: [
 *       { url: "https://...", keyword: "technology" },
 *       { url: "https://...", keyword: "science" }
 *     ],
 *     audioUrl: "https://your-audio-file.mp3",
 *     readingLevel: 5
 *   },
 *   "/path/to/output/video.mp4"
 * );
 * 
 * if (result.success) {
 *   console.log("Video created:", result.videoPath);
 * } else {
 *   console.error("Error:", result.error);
 * }
 */
