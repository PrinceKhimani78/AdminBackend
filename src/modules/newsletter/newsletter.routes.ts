import { Router } from 'express';
import { subscribeNewsletter, getNewsletterLeads, unsubscribeNewsletter } from './newsletter.controller';
import { authenticate, authorizeSuperAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Public route to subscribe
router.post('/', subscribeNewsletter);

// Protected routes (Super Admin only)
router.get('/', authenticate, authorizeSuperAdmin, getNewsletterLeads);
router.delete('/:id', authenticate, authorizeSuperAdmin, unsubscribeNewsletter);

export default router;
