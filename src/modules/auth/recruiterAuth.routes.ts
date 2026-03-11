import { Router } from 'express';
import { register, login } from './recruiterAuth.controller';

const router = Router();

// Recruiter Registration
router.post('/register', register);

// Recruiter Login
router.post('/login', login);

export default router;
