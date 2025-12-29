import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { FILE_UPLOAD_CONFIG } from '../config/fileUpload.config';

/**
 * Multer error handler middleware
 * Handles file upload errors gracefully with configuration-based messages
 */
export const handleMulterError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    // Multer-specific errors
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(400).json({
          success: false,
          message: `File size exceeds the limit. Max: ${FILE_UPLOAD_CONFIG.PROFILE_PHOTO.MAX_SIZE_MB}MB for photos, ${FILE_UPLOAD_CONFIG.RESUME.MAX_SIZE_MB}MB for resumes`,
          error: error.message,
          limits: {
            profile_photo: `${FILE_UPLOAD_CONFIG.PROFILE_PHOTO.MAX_SIZE_MB}MB`,
            resume: `${FILE_UPLOAD_CONFIG.RESUME.MAX_SIZE_MB}MB`,
          },
        });
        break;
      case 'LIMIT_FILE_COUNT':
        res.status(400).json({
          success: false,
          message: `Too many files uploaded. Maximum ${FILE_UPLOAD_CONFIG.GENERAL.MAX_FILES} files allowed`,
          error: error.message,
        });
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({
          success: false,
          message: 'Unexpected field name. Use "profile_photo" or "resume"',
          error: error.message,
        });
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'File upload error',
          error: error.message,
        });
    }
  } else if (error && error.message) {
    // Custom errors from fileFilter
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } else {
    // Pass to global error handler
    next(error);
  }
};
