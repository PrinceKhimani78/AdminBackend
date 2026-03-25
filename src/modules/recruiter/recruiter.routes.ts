import { Router } from 'express';
import * as recruiterController from './recruiter.controller';
import { authenticate, authorizeAdmin, authorizeSuperAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Recruiter Profile (Recruiter self)
router.get('/profile', authenticate, recruiterController.getRecruiterProfile);
router.put('/profile', authenticate, recruiterController.updateRecruiterProfile);
router.get('/stats', authenticate, recruiterController.getRecruiterStats);
router.get('/recent-applicants', authenticate, recruiterController.getRecentApplicants);
router.post('/request-industry', authenticate, recruiterController.requestIndustry);

// Admin Endpoints
router.get('/pending', authenticate, authorizeAdmin, recruiterController.getPendingRecruiters);
router.post('/approve/:id', authenticate, authorizeSuperAdmin, recruiterController.approveRecruiter);
router.post('/reject/:id', authenticate, authorizeSuperAdmin, recruiterController.rejectRecruiter);

router.get('/industry-requests', authenticate, authorizeAdmin, recruiterController.getPendingIndustries);
router.get('/industries-list', authenticate, authorizeAdmin, recruiterController.getAllRecruiterIndustries);
router.post('/approve-industry', authenticate, authorizeSuperAdmin, recruiterController.approveIndustry);
router.post('/reject-industry', authenticate, authorizeSuperAdmin, recruiterController.rejectIndustry);

export default router;
