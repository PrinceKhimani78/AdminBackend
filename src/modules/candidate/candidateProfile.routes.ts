import { Router } from 'express';
import * as candidateController from './candidateProfile.controller';
import { uploadCandidateFiles } from '../../middleware/upload.middleware';
import { validateUUID, checkValidation } from '../../middleware/inputValidator';
import { validateWithJoi } from '../../middleware/joiValidator';
import { createCandidateProfileSchema, updateCandidateProfileSchema } from './candidateProfile.validator';
import { scanUploadedFile, validateFileType, validateFileSize } from '../../middleware/virusScanner';
import { transformFrontendFields } from '../../middleware/fieldTransformer.middleware';

const router = Router();

// Main CRUD operations with SQL injection protection
router.get('/', candidateController.getAllProfiles);
router.get('/:id', validateUUID, checkValidation, candidateController.getProfile);
router.post('/', transformFrontendFields, validateWithJoi(createCandidateProfileSchema), candidateController.createProfile);
router.put('/:id', validateUUID, transformFrontendFields, validateWithJoi(updateCandidateProfileSchema), candidateController.updateProfile);
router.delete('/:id', validateUUID, checkValidation, candidateController.deleteProfile);

// Document endpoints with file validation
router.get('/:id/documents', validateUUID, checkValidation, candidateController.getCandidateDocuments);
router.post('/:id/upload',
  validateUUID,
  checkValidation,
  uploadCandidateFiles,
  validateFileType,
  validateFileSize(5), // Max 5MB for photos
  scanUploadedFile,
  candidateController.uploadDocument
);

// Streaming download endpoints
router.get('/:id/download/photo', validateUUID, checkValidation, candidateController.downloadProfilePhoto);
router.get('/:id/download/resume', validateUUID, checkValidation, candidateController.downloadResume);

export default router;
