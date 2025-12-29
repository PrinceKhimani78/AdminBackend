import { Request, Response, NextFunction } from 'express';
import * as otpService from './otp.service';

/**
 * Send OTP to email
 * POST /api/send-otp
 */
export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    
    await otpService.sendOtpEmail(email);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid login')) {
      res.status(500).json({
        success: false,
        error: 'Failed to send email. Please check SMTP configuration',
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
    });
  }
};

/**
 * Verify OTP
 * POST /api/verify-otp
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: 'Missing fields',
      });
      return;
    }
    
    const result = otpService.verifyOtp(email, otp);
    
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
