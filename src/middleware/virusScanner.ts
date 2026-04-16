import NodeClam from 'clamscan'; // Virus scanning re-enabled
import fs from 'fs/promises';
import path from 'path';

let clamScanner: any = null;

// Initialize ClamAV scanner
const initScanner = async () => {
  try {
    const clam = new NodeClam();
    clamScanner = await clam.init({
      clamdscan: {
        host: '127.0.0.1',
        port: 3310,
        timeout: 60000,
      },
      preference: 'clamdscan'
    });
    console.log('✅ ClamAV Scanner Initialized');
    return clamScanner;
  } catch (error) {
    console.error('❌ Failed to initialize ClamAV:', error);
    return null;
  }
};

// Start initialization
initScanner();

// Scan uploaded file for viruses
export const scanUploadedFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !clamScanner) return next();

  try {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    
    for (const file of files) {
      const { isInfected, viruses } = await clamScanner.scanFile((file as any).path);
      
      if (isInfected) {
        // Delete infected file
        await fs.unlink((file as any).path);
        
        return res.status(400).json({
          success: false,
          message: 'Security Alert: File is infected!',
          viruses
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Virus scan error:', error);
    next(); // Continue even if scanner fails, or handle as error
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
