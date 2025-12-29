import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';

interface DocumentProcessingOptions {
  filePath: string;
  virusScan?: boolean;
  extractText?: boolean;
  validateSize?: boolean;
}

interface DocumentProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Process document using worker thread to avoid blocking main thread
 * Useful for: PDF text extraction, virus scanning, validation
 */
export const processDocumentAsync = (options: DocumentProcessingOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { filePath, virusScan = false, extractText = false, validateSize = true } = options;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return reject(new Error('Document file does not exist'));
    }
    
    // Determine file type
    const ext = path.extname(filePath).toLowerCase();
    let fileType: 'pdf' | 'doc' | 'docx';
    
    if (ext === '.pdf') {
      fileType = 'pdf';
    } else if (ext === '.doc') {
      fileType = 'doc';
    } else if (ext === '.docx') {
      fileType = 'docx';
    } else {
      return reject(new Error('Unsupported document type'));
    }
    
    // Create worker thread for document processing
    const workerPath = path.join(__dirname, '../workers/documentProcessor.worker.js');
    const worker = new Worker(workerPath, {
      workerData: {
        filePath,
        fileType,
        options: {
          virusScan,
          extractText,
          validateSize,
        },
      },
    });
    
    // Handle worker completion
    worker.on('message', (result: DocumentProcessingResult) => {
      if (result.success) {
        resolve(result.data);
      } else {
        reject(new Error(result.error || 'Document processing failed'));
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
 * Check if file is a document (PDF, DOC, DOCX)
 */
export const isDocumentFile = (filename: string): boolean => {
  const documentExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(filename).toLowerCase();
  return documentExtensions.includes(ext);
};

/**
 * Get file size in MB
 */
export const getFileSizeInMB = (filePath: string): number => {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
};
