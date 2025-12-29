import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Temp storage for photos uploaded before profile creation
const tempUploadDir = path.join(__dirname, '../../../uploads/temp');

if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    cb(null, `temp_photo_${timestamp}_${randomStr}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, PNG, WEBP allowed'));
    }
  },
});

/**
 * POST /api/upload-photo
 * Upload photo and return URL (for frontend compatibility)
 * Note: This creates temporary files that should be moved when profile is created
 */
router.post('/upload-photo', upload.single('photo'), (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/temp/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename, // Send filename so frontend can send it with profile creation
    });

    // Optional: Process image in background
    (async () => {
      try {
        const { processImageAsync, isImageFile } = await import('../utils/imageProcessingUtil');
        if (isImageFile(req.file!.path)) {
          await processImageAsync({
            inputPath: req.file!.path,
            maxWidth: 400,
            maxHeight: 500,
            quality: 85,
          });
        }
      } catch (error) {
        console.error('Background image processing error:', error);
      }
    })();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Upload failed. Please try again',
    });
  }
});

export default router;
