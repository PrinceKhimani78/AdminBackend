import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, changePassword } from './recruiterAuth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Recruiter Registration
router.post('/register', register);

// Recruiter Login
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);

export default router;
