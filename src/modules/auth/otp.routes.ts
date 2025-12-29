import { Router } from 'express';
import * as otpController from './otp.controller';
import { validate } from '../../middleware/validate.middleware';
import { sendOtpSchema, verifyOtpSchema } from './otp.validator';

const router = Router();

router.post('/send-otp', validate(sendOtpSchema), otpController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), otpController.verifyOtp);

export default router;
