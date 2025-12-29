import { Router } from 'express';
import candidateProfileRoutes from '../modules/candidate/candidateProfile.routes';
import lookupRoutes from '../modules/lookup/lookup.routes';
import otpRoutes from '../modules/auth/otp.routes';
import uploadPhotoRoutes from './upload.routes';
import { handleMulterError } from '../middleware/multerError.middleware';

const router = Router();

// Auth routes (OTP) - Keep separate as it's authentication
router.use('/', otpRoutes);

// Standalone photo upload (frontend compatibility)
router.use('/', uploadPhotoRoutes);

// Candidate profile routes (includes upload, resume, CRUD operations)
router.use('/candidate-profile', candidateProfileRoutes); 

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
