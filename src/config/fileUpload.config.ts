/**
 * File Upload Configuration
 * Central configuration for all file upload settings
 */

export const FILE_UPLOAD_CONFIG = {
  // Profile Photo Settings
  PROFILE_PHOTO: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    PROCESSING: {
      MAX_WIDTH: 800,
      MAX_HEIGHT: 800,
      QUALITY: 85,
    },
  },

  // Resume Settings
  RESUME: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  },

  // General Settings
  GENERAL: {
    MAX_FILES: 2, // Max 2 files (photo + resume)
    UPLOAD_TIMEOUT_MS: 60000, // 60 seconds
    STREAM_CHUNK_SIZE: 64 * 1024, // 64KB chunks for streaming
  },
};

/**
 * Validate file size
 */
export const validateFileSize = (fileSize: number, maxSize: number): boolean => {
  return fileSize <= maxSize;
};

/**
 * Validate file type
 */
export const validateFileType = (mimetype: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(mimetype);
};

/**
 * Validate file extension
 */
export const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return allowedExtensions.includes(ext);
};

/**
 * Format file size to human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
