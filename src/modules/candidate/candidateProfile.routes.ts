import { Router } from 'express';
import * as candidateController from './candidateProfile.controller';
import { uploadCandidateFiles } from '../../middleware/upload.middleware';
import { validateCandidateProfile, validateUUID, checkValidation } from '../../middleware/inputValidator';
import { scanUploadedFile, validateFileType, validateFileSize } from '../../middleware/virusScanner';
import { transformFrontendFields } from '../../middleware/fieldTransformer.middleware';

const router = Router();

// Main CRUD operations with SQL injection protection
router.get('/', candidateController.getAllProfiles);
router.get('/:id', validateUUID, checkValidation, candidateController.getProfile);
router.post('/', transformFrontendFields, validateCandidateProfile, checkValidation, candidateController.createProfile);
router.put('/:id', validateUUID, transformFrontendFields, validateCandidateProfile, checkValidation, candidateController.updateProfile);
router.delete('/:id', validateUUID, checkValidation, candidateController.deleteProfile);

// Document endpoints with virus scanning
router.get('/:id/documents', validateUUID, checkValidation, candidateController.getCandidateDocuments);
router.post('/:id/upload', 
  validateUUID, 
  checkValidation,
  uploadCandidateFiles, 
  validateFileType,
  validateFileSize(5), // Max 5MB
  scanUploadedFile,
  candidateController.uploadDocument
);

// Streaming download endpoints
router.get('/:id/download/photo', validateUUID, checkValidation, candidateController.downloadProfilePhoto);
router.get('/:id/download/resume', validateUUID, checkValidation, candidateController.downloadResume);

export default router;
