import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin.model';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body; // email field now acts as identifier (email or username)

// 1. Find admin by email or username
        const identifier = email.toLowerCase().trim();
        const { Op } = require('sequelize');
        
        const admin = await Admin.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });
        
        if (!admin) {
            console.log('DEBUG: Admin not found with identifier:', identifier);
            res.status(401).json({ success: false, message: 'Invalid admin credentials' });
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

// Create a new admin (Superadmin only)
export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, username, password, name, role } = req.body;

        const existingEmail = await Admin.findOne({ where: { email } });
        if (existingEmail) {
            res.status(400).json({ success: false, message: 'Admin with this email already exists' });
            return;
        }

        if (username) {
            const existingUser = await Admin.findOne({ where: { username } });
            if (existingUser) {
                res.status(400).json({ success: false, message: 'Admin with this username already exists' });
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            email,
            username,
            password: hashedPassword,
            name,
            role: role || 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: { id: admin.id, email: admin.email, role: admin.role, name: admin.name }
        });
    } catch (error) {
        next(error);
    }
};
