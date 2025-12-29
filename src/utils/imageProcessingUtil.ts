import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';

interface ImageProcessingOptions {
  inputPath: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

interface ImageProcessingResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

/**
 * Process image using worker thread to avoid blocking main thread
 * This is crucial for handling heavy image operations
 */
export const processImageAsync = (options: ImageProcessingOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      inputPath,
      maxWidth = 800,
      maxHeight = 800,
      quality = 85,
    } = options;
    
    // Generate output path (processed image)
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `${basename}_processed${ext}`);
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      return reject(new Error('Input file does not exist'));
    }
    
    // Create worker thread for image processing
    const workerPath = path.join(__dirname, '../workers/imageProcessor.worker.js');
    const worker = new Worker(workerPath, {
      workerData: {
        inputPath,
        outputPath,
        maxWidth,
        maxHeight,
        quality,
      },
    });
    
    // Handle worker completion
    worker.on('message', (result: ImageProcessingResult) => {
      if (result.success && result.outputPath) {
        // Delete original file and rename processed file
        fs.unlink(inputPath, (err) => {
          if (err) {
            console.error('Error deleting original file:', err);
          }
          
          // Rename processed file to original name
          fs.rename(result.outputPath!, inputPath, (renameErr) => {
            if (renameErr) {
              console.error('Error renaming processed file:', renameErr);
              return reject(new Error('Failed to rename processed file'));
            }
            resolve(inputPath);
          });
        });
      } else {
        reject(new Error(result.error || 'Image processing failed'));
      }
    });
    
    // Handle worker errors
    worker.on('error', (error) => {
      reject(new Error(`Worker error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    });
    
    // Handle worker exit
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

/**
 * Check if file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
};
