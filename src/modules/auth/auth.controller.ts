import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as otpService from './otp.service';
import CandidateModel from '../../models/candidateProfile.model';
import { v4 as uuidv4 } from 'uuid';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email: rawEmail, password, fullName, otp } = req.body;
        const email = rawEmail.toLowerCase();
        console.log('DEBUG: Register request received:', { email, fullName, otp, hasPassword: !!password });

        // 1. Verify OTP
        const otpResult = otpService.verifyOtp(email, otp);
        console.log('DEBUG: OTP verify result:', otpResult);
        if (!otpResult.success) {
            res.status(400).json({ success: false, message: otpResult.message });
            return;
        }

        // 2. Check if user exists
        const existingUser = await CandidateModel.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'User already exists with this email' });
            return;
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create candidate profile
        const candidate = await CandidateModel.create({
            id: uuidv4(),
            email,
            password: hashedPassword,
            full_name: fullName,
            status: 'Active',
            mobile_number: '', // Placeholder, as per "not mobile number" rule
            gender: 'Other', // Placeholder
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { id: candidate.id, email: candidate.email, fullName: candidate.full_name }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await CandidateModel.findOne({ where: { email } });
        if (!user || !user.password) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: { id: user.id, email: user.email, fullName: user.full_name }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email: rawEmail } = req.body;
        if (!rawEmail) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }
        const email = rawEmail.toLowerCase();
        
        const user = await CandidateModel.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found with this email' });
            return;
        }

        await otpService.sendOtpEmail(email);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email: rawEmail, otp, newPassword } = req.body;
        if (!rawEmail || !otp || !newPassword) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        const email = rawEmail.toLowerCase();

        const otpResult = otpService.verifyOtp(email, otp);
        if (!otpResult.success) {
            res.status(400).json({ success: false, message: otpResult.message });
            return;
        }

        const user = await CandidateModel.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await CandidateModel.update({ password: hashedPassword }, { where: { email } });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        const candidateId = (req as any).user?.id;

        if (!candidateId || !oldPassword || !newPassword) {
            res.status(400).json({ success: false, message: 'Missing required fields or unauthorized' });
            return;
        }

        const user = await CandidateModel.findByPk(candidateId);
        if (!user || !user.password) {
            res.status(404).json({ success: false, message: 'User not found or password not set' });
            return;
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Incorrect old password' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await CandidateModel.update({ password: hashedPassword }, { where: { id: candidateId } });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};
