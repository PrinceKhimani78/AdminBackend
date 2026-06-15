import { Router } from 'express';
import { createJob, getMyJobs, updateJobStatus, getAllActiveJobs, getJobById, updateJob, getPublicJobById, deleteJob } from './job.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllActiveJobs);
router.get('/view/:id', getPublicJobById);

// Protected routes (Require login via authenticate middleware)
router.use(authenticate);

// Recruiter specific
router.post('/create', createJob);
router.get('/recruiter', getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.patch('/:id/status', updateJobStatus);
router.delete('/:id', deleteJob);

export default router;
