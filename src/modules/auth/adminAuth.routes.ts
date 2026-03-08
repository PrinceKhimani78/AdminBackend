import { Router } from 'express';
import * as adminAuthController from './adminAuth.controller';
import { authenticate, authorizeSuperAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.post('/login', adminAuthController.login);
router.post('/create', authenticate, authorizeSuperAdmin, adminAuthController.createAdmin);

export default router;
