/**
 * Candidate Profile Messages
 * All success and error messages for candidate profile operations
 */

export const CANDIDATE_PROFILE_MESSAGES = {
  // Success Messages
  SUCCESS: {
    PROFILES_RETRIEVED: 'Profiles retrieved successfully',
    PROFILE_RETRIEVED: 'Profile retrieved successfully',
    PROFILE_CREATED: 'Profile created successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_DELETED: 'Profile deleted successfully',
    DOCUMENTS_RETRIEVED: 'Documents retrieved successfully',
    PHOTO_UPLOADED: 'Profile photo uploaded successfully',
    RESUME_UPLOADED: 'Resume uploaded successfully',
    BOTH_UPLOADED: 'Profile photo and resume uploaded successfully',
  },

  // Error Messages
  ERROR: {
    PROFILE_NOT_FOUND: 'Candidate profile not found',
    CANDIDATE_NOT_FOUND: 'Candidate not found',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    NO_FILE_PROVIDED: 'No file provided. Upload profile_photo and/or resume',
    PHOTO_NOT_FOUND: 'Profile photo not found',
    RESUME_NOT_FOUND: 'Resume not found',
    PHOTO_FILE_NOT_FOUND: 'Profile photo file not found on server',
    RESUME_FILE_NOT_FOUND: 'Resume file not found on server',
    FILE_STREAM_ERROR: 'Error streaming file',
  },

  // Processing Messages
  PROCESSING: {
    IMAGE_ERROR: 'Image processing error (non-critical):',
    RESUME_ERROR: 'Resume processing error (non-critical):',
    BACKGROUND_ERROR: 'Background image processing error:',
    RESUME_SUCCESS: 'Resume processed successfully:',
  },
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
};

/**
 * File Processing Settings
 */
export const FILE_PROCESSING = {
  IMAGE: {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 800,
    QUALITY: 85,
  },
  STREAM: {
    CHUNK_SIZE: 64 * 1024, // 64KB
  },
  CACHE: {
    IMAGE_MAX_AGE: 31536000, // 1 year in seconds
    NO_CACHE: 'no-cache',
    PUBLIC_CACHE: 'public, max-age=31536000',
  },
  CONTENT_DISPOSITION: {
    INLINE: 'inline',
    ATTACHMENT: 'attachment',
  },
};

/**
 * Content Types
 */
export const CONTENT_TYPES = {
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  APPLICATION_PDF: 'application/pdf',
  APPLICATION_MSWORD: 'application/msword',
  APPLICATION_DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  OCTET_STREAM: 'application/octet-stream',
};

/**
 * File Extensions
 */
export const FILE_EXTENSIONS = {
  PDF: '.pdf',
  DOC: '.doc',
  DOCX: '.docx',
  JPG: '.jpg',
  JPEG: '.jpeg',
  PNG: '.png',
  GIF: '.gif',
  WEBP: '.webp',
};

/**
 * File Field Names
 */
export const FILE_FIELDS = {
  PROFILE_PHOTO: 'profile_photo',
  RESUME: 'resume',
};

/**
 * Upload Paths
 */
export const UPLOAD_PATHS = {
  BASE: 'uploads',
  PROFILE_PHOTO: 'profile_photo',
  RESUME: 'resume',
};

/**
 * Database Status
 */
export const CANDIDATE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

/**
 * Sort Order
 */
export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};
