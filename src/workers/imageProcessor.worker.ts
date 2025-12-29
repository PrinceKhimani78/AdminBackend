import { parentPort, workerData } from 'worker_threads';
import sharp from 'sharp';
import path from 'path';

interface ImageProcessingData {
  inputPath: string;
  outputPath: string;
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

/**
 * Image processing worker
 * Runs in a separate thread to avoid blocking the main thread
 */
async function processImage(data: ImageProcessingData) {
  const { inputPath, outputPath, maxWidth, maxHeight, quality } = data;
  
  try {
    await sharp(inputPath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality, progressive: true })
      .toFile(outputPath);
    
    return { success: true, outputPath };
  } catch (error) {
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Execute if running as worker
if (parentPort) {
  processImage(workerData)
    .then(result => {
      parentPort!.postMessage({ success: true, data: result });
    })
    .catch(error => {
      parentPort!.postMessage({ success: false, error: error.message });
    });
}

export { processImage };
