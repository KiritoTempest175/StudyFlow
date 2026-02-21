import express from 'express';
import cors from 'cors';
import { generateVideo } from './utils/generateVideo';
import { VideoGenerationInput } from './types';
import path from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Output directory for videos
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
fs.mkdir(OUTPUT_DIR, { recursive: true });

/**
 * POST /generate-video
 * 
 * Request body:
 * {
 *   script: string,
 *   summary: string,
 *   title?: string,
 *   images?: { url: string, keyword: string }[],
 *   audioUrl?: string,
 *   readingLevel?: number
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   videoUrl?: string,
 *   videoPath?: string,
 *   duration?: number,
 *   error?: string
 * }
 */
app.post('/generate-video', async (req, res) => {
  // Disable socket timeout for this long-running request
  req.setTimeout(0);
  res.setTimeout(0);
  try {
    const input: VideoGenerationInput = req.body;

    // Validate input
    if (!input.script) {
      return res.status(400).json({
        success: false,
        error: 'Script is required',
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `video_${timestamp}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    console.log('Received video generation request');
    console.log('Script length:', input.script.length);
    console.log('Image count:', input.images?.length || 0);
    console.log('Audio URL:', input.audioUrl || '(none)');
    console.log('Audio Duration:', input.audioDuration || '(none)');

    // Generate video
    const result = await generateVideo(input, outputPath);

    if (result.success) {
      // Return video URL
      const videoUrl = `/videos/${filename}`;

      res.json({
        success: true,
        videoUrl,
        videoPath: result.videoPath,
        message: 'Video generated successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Video generation failed',
      });
    }
  } catch (error) {
    console.error('Error in /generate-video:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /videos/:filename
 * Serve generated videos
 */
app.use('/videos', express.static(OUTPUT_DIR));

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'video-generation' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Video generation service running on http://localhost:${PORT}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
});

// Allow up to 35 minutes for long Remotion renders
server.headersTimeout = 35 * 60 * 1000;   // 35 min
server.requestTimeout = 35 * 60 * 1000;   // 35 min
server.keepAliveTimeout = 35 * 60 * 1000; // 35 min
server.timeout = 0;                        // No global socket timeout

export default app;
