import { Request, Response, NextFunction } from 'express';
// import NodeClam from 'clamscan'; // Virus scanning disabled
import fs from 'fs/promises';
import path from 'path';

let clamScanner: any = null;

// Initialize ClamAV scanner - DISABLED
const initScanner = async () => {
  // Virus scanning disabled
  return null;
};

// Scanner initialization disabled
// initScanner();

// Scan uploaded file for viruses - DISABLED
export const scanUploadedFile = async (req: Request, res: Response, next: NextFunction) => {
  // Virus scanning disabled - skip to next middleware
  next();
};

// Validate file types
export const validateFileType = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next();

  const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
  
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  for (const file of files) {
    const mimetype = (file as any).mimetype;
    
    if (!allowedMimes.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG allowed.'
      });
    }
  }

  next();
};

// Validate file size
export const validateFileSize = (maxSizeMB: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next();

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

    for (const file of files) {
      const size = (file as any).size;
      
      if (size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds ${maxSizeMB}MB limit`
        });
      }
    }

    next();
  };
};
