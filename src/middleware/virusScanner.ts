import { Request, Response, NextFunction } from 'express';
import NodeClam from 'clamscan';
import fs from 'fs/promises';
import path from 'path';

let clamScanner: any = null;

// Initialize ClamAV scanner
const initScanner = async () => {
  if (clamScanner) return clamScanner;
  
  try {
    const ClamScan = new NodeClam().init({
      removeInfected: true, // Automatically remove infected files
      quarantineInfected: false,
      debugMode: false,
      clamdscan: {
        host: process.env.CLAMAV_HOST || 'localhost',
        port: parseInt(process.env.CLAMAV_PORT || '3310', 10),
        timeout: 60000,
      },
      preference: 'clamdscan' // Use daemon for better performance
    });
    
    clamScanner = await ClamScan;
    console.log('✅ ClamAV scanner initialized');
    return clamScanner;
  } catch (error) {
    console.warn('⚠️  ClamAV not available, file scanning disabled');
    return null;
  }
};

// Initialize scanner on module load
initScanner();

// Scan uploaded file for viruses
export const scanUploadedFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if files were uploaded
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return next();
    }

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    
    // If scanner not available, skip scanning but log warning
    if (!clamScanner) {
      console.warn('⚠️  File uploaded without virus scan (ClamAV not available)');
      return next();
    }

    // Scan each uploaded file
    for (const file of files) {
      const filePath = (file as any).path || (file as any).tempFilePath;
      
      if (!filePath) continue;

      // Scan file
      const { isInfected, viruses } = await clamScanner.isInfected(filePath);
      
      if (isInfected) {
        // Delete infected file
        await fs.unlink(filePath).catch(() => {});
        
        return res.status(400).json({
          success: false,
          message: 'File contains virus or malware',
          details: viruses || ['Unknown threat detected']
        });
      }
    }

    // All files clean
    next();
  } catch (error) {
    console.error('Error scanning file:', error);
    // Continue without blocking on scan errors
    next();
  }
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
