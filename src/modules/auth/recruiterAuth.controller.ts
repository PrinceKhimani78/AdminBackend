import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Recruiter from '../../models/recruiter.model';
import { v4 as uuidv4 } from 'uuid';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, fullName, companyName, mobileNumber } = req.body;
        const lowerEmail = email.toLowerCase();

        // 1. Check if recruiter already exists
        const existingRecruiter = await Recruiter.findOne({ where: { email: lowerEmail } });
        if (existingRecruiter) {
            res.status(409).json({ success: false, message: 'Recruiter already exists with this email' });
            return;
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create recruiter profile
        const recruiter = await Recruiter.create({
            id: uuidv4(),
            email: lowerEmail,
            password: hashedPassword,
            full_name: fullName,
            company_name: companyName,
            mobile_number: mobileNumber || null,
            status: 'PendingApproval',
        });

        res.status(201).json({
            success: true,
            message: 'we are working on your request',
            data: {
                user: {
                    id: recruiter.id,
                    email: recruiter.email,
                    fullName: recruiter.full_name,
                    companyName: recruiter.company_name,
                    status: (recruiter as any).status
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const lowerEmail = email.toLowerCase();

        // 1. Find recruiter
        const recruiter = await Recruiter.findOne({ where: { email: lowerEmail } });
        if (!recruiter || !recruiter.password) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, recruiter.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 3. Check approval status
        if ((recruiter as any).status === 'PendingApproval') {
            res.status(403).json({ success: false, message: 'we are working on your request' });
            return;
        }

        if ((recruiter as any).status === 'Inactive') {
            res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
            return;
        }

        // 4. Generate token
        const token = jwt.sign(
            { id: recruiter.id, email: recruiter.email, role: 'recruiter' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: recruiter.id,
                    email: recruiter.email,
                    fullName: recruiter.full_name,
                    companyName: recruiter.company_name,
                    status: (recruiter as any).status
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
