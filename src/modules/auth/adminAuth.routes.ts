import { Router } from 'express';
import * as adminAuthController from './adminAuth.controller';

const router = Router();

router.post('/login', adminAuthController.login);
router.post('/setup-initial', adminAuthController.createInitialAdmin);

export default router;
