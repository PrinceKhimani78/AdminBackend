import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.type === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
};

export const authorizeSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.type === 'admin' && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Superadmin only.' });
    }
};

export const authorizeAdminOrRecruiter = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.type === 'admin' || req.user.role === 'recruiter')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admin or Recruiter only.' });
    }
};
