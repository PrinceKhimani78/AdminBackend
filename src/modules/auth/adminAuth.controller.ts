import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin.model';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Find admin
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role, type: 'admin' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Optional: Initial admin setup helper (to be used once or via seeder)
export const createInitialAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, name, secretKey } = req.body;

        // Very basic protection for this helper
        if (secretKey !== process.env.ADMIN_SETUP_SECRET) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            email,
            password: hashedPassword,
            name,
            role: 'superadmin'
        });

        res.status(201).json({ success: true, data: { email: admin.email } });
    } catch (error) {
        next(error);
    }
};
