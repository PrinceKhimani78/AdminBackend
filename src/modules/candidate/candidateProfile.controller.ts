import { Request, Response, NextFunction } from 'express';
import * as candidateService from './candidateProfile.service';
import { sendSuccess, sendCreated, sendNotFound } from '../../utils/responseUtil';
import {
  CANDIDATE_PROFILE_MESSAGES,
  HTTP_STATUS,
  PAGINATION,
  FILE_PROCESSING,
  CONTENT_TYPES,
  FILE_EXTENSIONS,
} from '../../constants/candidateProfile.constants';

/**
 * Get all candidate profiles with pagination
 * GET /api/candidate-profile?page=1&limit=10
 */
export const getAllProfiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT;
    
    const result = await candidateService.getAllCandidates(page, limit);
    sendSuccess(res, result, CANDIDATE_PROFILE_MESSAGES.SUCCESS.PROFILES_RETRIEVED);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single candidate profile with work experience and skills
 * GET /api/candidate-profile/:id
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await candidateService.getCandidateById(id);
    
    if (!profile) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.PROFILE_NOT_FOUND);
      return;
    }
    
    sendSuccess(res, profile, CANDIDATE_PROFILE_MESSAGES.SUCCESS.PROFILE_RETRIEVED);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new candidate profile (Personal + Work Experience + Skills + Availability)
 * POST /api/candidate-profile
 */
export const createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ip_address = req.ip || req.socket.remoteAddress;
    const candidateId = await candidateService.createCandidate(req.body, ip_address);
    
    const profile = await candidateService.getCandidateById(candidateId);
    sendCreated(res, profile, CANDIDATE_PROFILE_MESSAGES.SUCCESS.PROFILE_CREATED);
  } catch (error) {
    if (error instanceof Error && error.message === CANDIDATE_PROFILE_MESSAGES.ERROR.EMAIL_ALREADY_EXISTS) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * Update candidate profile
 * PUT /api/candidate-profile/:id
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await candidateService.updateCandidate(id, req.body);
    
    if (!updated) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.PROFILE_NOT_FOUND);
      return;
    }
    
    const profile = await candidateService.getCandidateById(id);
    sendSuccess(res, profile, CANDIDATE_PROFILE_MESSAGES.SUCCESS.PROFILE_UPDATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete candidate profile (cascading delete for work, skills, etc.)
 * DELETE /api/candidate-profile/:id
 */
export const deleteProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await candidateService.deleteCandidate(id);
    
    if (!deleted) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.PROFILE_NOT_FOUND);
      return;
    }
    
    sendSuccess(res, null, CANDIDATE_PROFILE_MESSAGES.SUCCESS.PROFILE_DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate documents (profile photo & resume)
 * GET /api/candidate-profile/:id/documents
 */
export const getCandidateDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const documents = await candidateService.getCandidateDocuments(id);
    
    if (!documents) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.CANDIDATE_NOT_FOUND);
      return;
    }
    
    sendSuccess(res, documents, CANDIDATE_PROFILE_MESSAGES.SUCCESS.DOCUMENTS_RETRIEVED);
  } catch (error) {
    next(error);
  }
};

/**
 * Download candidate profile photo (streaming for large files)
 * GET /api/candidate-profile/:id/download/photo
 */
export const downloadProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const fs = await import('fs');
    const path = await import('path');
    
    const candidate = await candidateService.getCandidateById(id);
    
    if (!candidate || !candidate.profile_photo) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.PHOTO_NOT_FOUND);
      return;
    }
    
    const filePath = path.join(__dirname, '../../../uploads', candidate.profile_photo);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.PHOTO_FILE_NOT_FOUND);
      return;
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const fileName = path.basename(filePath);
    
    // Set headers for streaming
    res.setHeader('Content-Type', CONTENT_TYPES.IMAGE_JPEG);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', `${FILE_PROCESSING.CONTENT_DISPOSITION.INLINE}; filename="${fileName}"`);
    res.setHeader('Cache-Control', FILE_PROCESSING.CACHE.PUBLIC_CACHE);
    
    // Create read stream and pipe to response (non-blocking)
    const readStream = fs.createReadStream(filePath, {
      highWaterMark: FILE_PROCESSING.STREAM.CHUNK_SIZE,
    });
    
    readStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
          success: false, 
          message: CANDIDATE_PROFILE_MESSAGES.ERROR.FILE_STREAM_ERROR 
        });
      }
    });
    
    // Pipe file to response (streaming, non-blocking)
    readStream.pipe(res);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Download candidate resume (streaming for large files)
 * GET /api/candidate-profile/:id/download/resume
 */
export const downloadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const fs = await import('fs');
    const path = await import('path');
    
    const candidate = await candidateService.getCandidateById(id);
    
    if (!candidate || !candidate.resume) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.RESUME_NOT_FOUND);
      return;
    }
    
    const filePath = path.join(__dirname, '../../../uploads', candidate.resume);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.RESUME_FILE_NOT_FOUND);
      return;
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Set appropriate content type
    let contentType = CONTENT_TYPES.OCTET_STREAM;
    if (ext === FILE_EXTENSIONS.PDF) {
      contentType = CONTENT_TYPES.APPLICATION_PDF;
    } else if (ext === FILE_EXTENSIONS.DOC) {
      contentType = CONTENT_TYPES.APPLICATION_MSWORD;
    } else if (ext === FILE_EXTENSIONS.DOCX) {
      contentType = CONTENT_TYPES.APPLICATION_DOCX;
    }
    
    // Set headers for streaming download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', `${FILE_PROCESSING.CONTENT_DISPOSITION.ATTACHMENT}; filename="${fileName}"`);
    res.setHeader('Cache-Control', FILE_PROCESSING.CACHE.NO_CACHE);
    
    // Create read stream and pipe to response (non-blocking)
    const readStream = fs.createReadStream(filePath, {
      highWaterMark: FILE_PROCESSING.STREAM.CHUNK_SIZE,
    });
    
    readStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
          success: false, 
          message: CANDIDATE_PROFILE_MESSAGES.ERROR.FILE_STREAM_ERROR 
        });
      }
    });
    
    // Pipe file to response (streaming, non-blocking)
    readStream.pipe(res);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Universal file upload for existing candidate
 * Supports uploading profile_photo and/or resume (both at once or one at a time)
 * POST /api/candidate-profile/:id/upload
 * Uses worker threads for image processing to avoid blocking main thread
 */
export const uploadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || Object.keys(files).length === 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: CANDIDATE_PROFILE_MESSAGES.ERROR.NO_FILE_PROVIDED,
      });
      return;
    }
    
    const uploadedFiles: any = {};
    const processingPromises: Promise<void>[] = [];
    
    // Process profile photo (async with worker thread)
    if (files.profile_photo && files.profile_photo[0]) {
      const file = files.profile_photo[0];
      const relativePath = file.path.replace(/.*\/uploads\//, '');
      uploadedFiles.profile_photo = relativePath;
      
      // Process image in background worker thread (non-blocking)
      const imageProcessingPromise = (async () => {
        try {
          const { processImageAsync, isImageFile } = await import('../../utils/imageProcessingUtil');
          if (isImageFile(file.path)) {
            await processImageAsync({
              inputPath: file.path,
              maxWidth: FILE_PROCESSING.IMAGE.MAX_WIDTH,
              maxHeight: FILE_PROCESSING.IMAGE.MAX_HEIGHT,
              quality: FILE_PROCESSING.IMAGE.QUALITY,
            });
          }
        } catch (error) {
          console.error(CANDIDATE_PROFILE_MESSAGES.PROCESSING.IMAGE_ERROR, error);
        }
      })();
      
      processingPromises.push(imageProcessingPromise);
    }
    
    // Process resume (async with worker thread for consistency)
    if (files.resume && files.resume[0]) {
      const file = files.resume[0];
      const relativePath = file.path.replace(/.*\/uploads\//, '');
      uploadedFiles.resume = relativePath;
      
      // Process resume in background worker thread (non-blocking)
      const resumeProcessingPromise = (async () => {
        try {
          const { processDocumentAsync, isDocumentFile } = await import('../../utils/documentProcessingUtil');
          if (isDocumentFile(file.path)) {
            const result = await processDocumentAsync({
              filePath: file.path,
              validateSize: true,
              extractText: false,
              virusScan: false,
            });
            console.log(CANDIDATE_PROFILE_MESSAGES.PROCESSING.RESUME_SUCCESS, result.metadata);
          }
        } catch (error) {
          console.error(CANDIDATE_PROFILE_MESSAGES.PROCESSING.RESUME_ERROR, error);
        }
      })();
      
      processingPromises.push(resumeProcessingPromise);
    }
    
    // Update candidate with file paths immediately (don't wait for processing)
    const updated = await candidateService.updateCandidateFiles(id, uploadedFiles);
    
    if (!updated) {
      sendNotFound(res, CANDIDATE_PROFILE_MESSAGES.ERROR.CANDIDATE_NOT_FOUND);
      return;
    }
    
    // Build success message
    const uploadedTypes = Object.keys(uploadedFiles);
    const message = uploadedTypes.length === 2
      ? CANDIDATE_PROFILE_MESSAGES.SUCCESS.BOTH_UPLOADED
      : uploadedTypes.includes('profile_photo')
      ? CANDIDATE_PROFILE_MESSAGES.SUCCESS.PHOTO_UPLOADED
      : CANDIDATE_PROFILE_MESSAGES.SUCCESS.RESUME_UPLOADED;
    
    // Send response immediately
    sendSuccess(res, uploadedFiles, message);
    
    // Continue processing in background (non-blocking)
    Promise.all(processingPromises).catch(error => {
      console.error(CANDIDATE_PROFILE_MESSAGES.PROCESSING.BACKGROUND_ERROR, error);
    });
    
  } catch (error) {
    next(error);
  }
};
