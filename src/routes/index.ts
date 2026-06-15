import { Router } from 'express';
import candidateProfileRoutes from '../modules/candidate/candidateProfile.routes';
import lookupRoutes from '../modules/lookup/lookup.routes';
import otpRoutes from '../modules/auth/otp.routes';
import authRoutes from '../modules/auth/auth.routes';
import adminAuthRoutes from '../modules/auth/adminAuth.routes';
import recruiterAuthRoutes from '../modules/auth/recruiterAuth.routes';
import jobRoutes from '../modules/jobs/job.routes';
import recruiterRoutes from '../modules/recruiter/recruiter.routes';
import uploadPhotoRoutes from './upload.routes';
import applicationRoutes from '../modules/applications/application.routes';
import newsletterRoutes from '../modules/newsletter/newsletter.routes';
import { handleMulterError } from '../middleware/multerError.middleware';

const router = Router();

// Auth routes (OTP and standardized logins)
router.use('/', otpRoutes);
router.use('/auth', authRoutes); // Candidates
router.use('/admin/auth', adminAuthRoutes); // Admins
router.use('/recruiter/auth', recruiterAuthRoutes); // Recruiters
router.use('/recruiter', recruiterRoutes); // Recruiter profile & admin management

// Standalone photo upload (frontend compatibility)
router.use('/', uploadPhotoRoutes);

// Candidate profile routes (includes upload, resume, CRUD operations)
router.use('/candidate-profile', candidateProfileRoutes);

// Jobs routes
router.use('/jobs', jobRoutes);

// Applications routes
router.use('/applications', applicationRoutes);

// Newsletter routes
router.use('/newsletter', newsletterRoutes);

// Alias: /resume -> /candidate-profile for frontend compatibility
router.use('/resume', candidateProfileRoutes);

// Lookup routes
router.use('/lookup', lookupRoutes);

// Multer error handler (must be after routes that use multer)
router.use(handleMulterError);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

export default router;
