import { Router } from 'express';
import * as applicationController from './application.controller';
import { authenticate, authorizeAdminOrRecruiter } from '../../middleware/auth.middleware';
import { uploadApplicationResume } from '../../middleware/upload.middleware';

const router = Router();

// Candidate Routes
router.use(authenticate);
router.post('/apply', uploadApplicationResume, applicationController.applyJob); // Apply for a job with optional resume
router.get('/my-applications', applicationController.getMyApplications); // List my applications
router.get('/check/:jobId', applicationController.checkApplicationStatus); // Check if applied for a specific job

// Recruiter Routes (Require recruiter authorization)
router.get('/job/:jobId/applicants', authorizeAdminOrRecruiter, applicationController.getJobApplicants); // Get all applicants for a job
router.patch('/:id/status', authorizeAdminOrRecruiter, applicationController.updateApplicationStatus); // Update status of an application

export default router;
