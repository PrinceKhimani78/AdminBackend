import { Router } from 'express';
import candidateProfileRoutes from '../modules/candidate/candidateProfile.routes';
import lookupRoutes from '../modules/lookup/lookup.routes';
import otpRoutes from '../modules/auth/otp.routes';
import authRoutes from '../modules/auth/auth.routes';
import adminAuthRoutes from '../modules/auth/adminAuth.routes';
import uploadPhotoRoutes from './upload.routes';
import { handleMulterError } from '../middleware/multerError.middleware';

const router = Router();

// Auth routes (OTP) - Keep separate as it's authentication
router.use('/', otpRoutes);
router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);

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

// Debug routes
router.get('/debug-routes', (req, res) => {
  const routes: any[] = [];

  function print(path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
    } else if (layer.method) {
      routes.push({
        method: layer.method.toUpperCase(),
        path: '/' + path.concat(split(layer.regexp)).filter(Boolean).join('/')
      });
    }
  }

  function split(thing: any) {
    if (typeof thing === 'string') {
      return thing.split('/');
    } else if (thing.fast_slash) {
      return '';
    } else {
      const match = thing.toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\]|[^\\[.*+?^${}()|[\]\\])*)\$\//);
      return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>';
    }
  }

  // @ts-ignore
  router.stack.forEach(print.bind(null, []));

  res.json({ success: true, count: routes.length, routes });
});

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
