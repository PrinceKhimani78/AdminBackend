import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { FILE_UPLOAD_CONFIG } from '../config/fileUpload.config';

// Ensure upload directories exist
const uploadDirs = {
  profile_photo: path.join(__dirname, '../../uploads/profile_photo'),
  resume: path.join(__dirname, '../../uploads/resume'),
};

// Create directories if they don't exist
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const candidateId = req.params.id;
    let uploadPath: string;
    
    if (file.fieldname === 'profile_photo') {
      uploadPath = path.join(uploadDirs.profile_photo, candidateId);
    } else if (file.fieldname === 'resume') {
      uploadPath = path.join(uploadDirs.resume, candidateId);
    } else {
      return cb(new Error('Invalid field name'), '');
    }
    
    // Create candidate-specific directory
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const candidateId = req.params.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = file.fieldname === 'profile_photo' ? 'profile' : 'resume';
    
    // Generate filename: profile_123_1702567890.jpg or resume_123_1702567890.pdf
    const filename = `${baseName}_${candidateId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter with configuration-based validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'profile_photo') {
    // Validate file type
    const isValidType = FILE_UPLOAD_CONFIG.PROFILE_PHOTO.ALLOWED_TYPES.includes(file.mimetype);
    const isValidExtension = FILE_UPLOAD_CONFIG.PROFILE_PHOTO.ALLOWED_EXTENSIONS.some(
      ext => file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (isValidType && isValidExtension) {
      return cb(null, true);
    } else {
      const allowedExts = FILE_UPLOAD_CONFIG.PROFILE_PHOTO.ALLOWED_EXTENSIONS.join(', ');
      cb(new Error(`Only ${allowedExts} files are allowed for profile photo`));
    }
  } else if (file.fieldname === 'resume') {
    // Validate file type
    const isValidType = FILE_UPLOAD_CONFIG.RESUME.ALLOWED_TYPES.includes(file.mimetype);
    const isValidExtension = FILE_UPLOAD_CONFIG.RESUME.ALLOWED_EXTENSIONS.some(
      ext => file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (isValidType && isValidExtension) {
      return cb(null, true);
    } else {
      const allowedExts = FILE_UPLOAD_CONFIG.RESUME.ALLOWED_EXTENSIONS.join(', ');
      cb(new Error(`Only ${allowedExts} files are allowed for resume`));
    }
  } else {
    cb(new Error('Invalid field name. Use "profile_photo" or "resume"'));
  }
};

// Configure multer with size limits from config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Math.max(
      FILE_UPLOAD_CONFIG.PROFILE_PHOTO.MAX_SIZE_BYTES,
      FILE_UPLOAD_CONFIG.RESUME.MAX_SIZE_BYTES
    ), // Use larger limit (10MB for resume)
    files: FILE_UPLOAD_CONFIG.GENERAL.MAX_FILES,
  },
});

// Export middleware for handling both files
export const uploadCandidateFiles = upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

// Delete old file helper (non-blocking)
export const deleteOldFile = async (filePath: string): Promise<void> => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting old file:', error);
    // Don't throw - we don't want to fail the upload if old file deletion fails
  }
};
