import NodeCache from 'node-cache';
import nodemailer from 'nodemailer';
import { OtpData } from './otp.types';

// OTP Cache - 10 minute TTL
const otpCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 5,
};

/**
 * Generate a random 6-digit OTP
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send OTP email to user
 */
export const sendOtpEmail = async (email: string): Promise<void> => {
  // Generate OTP
  const otp = generateOtp();
  
  // Store OTP in cache with metadata
  const otpData: OtpData = {
    otp,
    createdAt: Date.now(),
    attempts: 0,
  };
  otpCache.set(email, otpData);
  
  // Create email transporter
  const transporter = createTransporter();
  
  // Email content
  const mailOptions = {
    from: `"Rojgari India" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Rojgari India OTP Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
          .otp-box { background-color: #fff; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
          .otp { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Rojgari India</h1>
          </div>
          <div class="content">
            <h2>Email Verification</h2>
            <p>Dear User,</p>
            <p>Thank you for registering with Rojgari India. Please use the following OTP to verify your email address:</p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
            </div>
            <p><strong>This OTP is valid for ${OTP_CONFIG.EXPIRY_MINUTES} minutes.</strong></p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Best regards,<br>Rojgari India Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear User,

Your OTP for email verification is: ${otp}

This OTP is valid for ${OTP_CONFIG.EXPIRY_MINUTES} minutes.

If you did not request this OTP, please ignore this email.

Regards,
Rojgari India Team
    `,
  };
  
  // Send email
  await transporter.sendMail(mailOptions);
};

/**
 * Verify OTP
 */
export const verifyOtp = (email: string, otp: string): { success: boolean; message: string } => {
  const otpData = otpCache.get<OtpData>(email);
  
  if (!otpData) {
    return {
      success: false,
      message: 'OTP expired or not found',
    };
  }
  
  // Check max attempts
  if (otpData.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    otpCache.del(email);
    return {
      success: false,
      message: 'Maximum verification attempts exceeded. Please request a new OTP',
    };
  }
  
  // Increment attempts
  otpData.attempts += 1;
  otpCache.set(email, otpData);
  
  // Verify OTP
  if (otpData.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }
  
  // Check expiry (10 minutes)
  const now = Date.now();
  const expiryTime = OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000;
  if (now - otpData.createdAt > expiryTime) {
    otpCache.del(email);
    return {
      success: false,
      message: 'OTP expired',
    };
  }
  
  // Success - delete OTP
  otpCache.del(email);
  return {
    success: true,
    message: 'OTP verified successfully',
  };
};
