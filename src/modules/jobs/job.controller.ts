import { Request, Response, NextFunction } from 'express';
import Job from '../../models/job.model';
import { v4 as uuidv4 } from 'uuid';

// Extended request to handle the user from the JWT middleware
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        type?: string;
    }
}

// 1. Create a new job listing (Recruiter or Admin)
export const createJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAdmin = req.user?.type === 'admin';
        const isRecruiter = req.user?.role === 'recruiter';
        const isSuperAdmin = req.user?.role === 'superadmin';

        if (!req.user || (!isAdmin && !isRecruiter && !isSuperAdmin)) {
            res.status(403).json({ success: false, message: 'Access denied. Only recruiters and admins can post jobs.' });
            return;
        }

        const { 
            title, 
            description, 
            requirements, 
            location, 
            job_category, 
            employment_type, 
            salary_min, 
            salary_max, 
            exp_min, 
            exp_max,
            company_name,
            perks_and_benefits,
            posting_as,
            department,
            job_role,
            qualifications,
            gender,
            skills,
            industry,
            languages,
            screening_questions,
            allow_calls,
            contact_name,
            contact_number,
            call_time_range,
            call_days
        } = req.body;

        const newJob = await Job.create({
            id: uuidv4(),
            title,
            description,
            requirements,
            location,
            job_category,
            employment_type: employment_type || 'Full-time',
            salary_min,
            salary_max,
            exp_min,
            exp_max,
            company_name,
            perks_and_benefits,
            posting_as: posting_as || 'Company',
            department,
            job_role,
            qualifications,
            gender,
            skills,
            industry,
            languages,
            screening_questions,
            allow_calls: allow_calls || false,
            contact_name,
            contact_number,
            call_time_range,
            call_days,
            recruiter_id: req.user.role === 'recruiter' ? req.user.id : null,
            status: 'Active'
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: newJob
        });
    } catch (error) {
        next(error);
    }
};

// 2. Get all jobs posted by the logged-in recruiter
export const getMyJobs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAdmin = req.user?.type === 'admin';
        if (!req.user || (req.user.role !== 'recruiter' && !isAdmin)) {
            res.status(403).json({ success: false, message: 'Access denied.' });
            return;
        }

        const whereClause = isAdmin ? {} : { recruiter_id: req.user.id };
        const jobs = await Job.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};

// 3. Update job status (e.g. from Active to Expired)
export const updateJobStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAdmin = req.user?.type === 'admin';
        if (!req.user || (req.user.role !== 'recruiter' && !isAdmin)) {
            res.status(403).json({ success: false, message: 'Access denied.' });
            return;
        }

        const { id } = req.params;
        const { status } = req.body; // should be 'Active', 'Expired', or 'Draft'

        const whereClause = isAdmin ? { id } : { id, recruiter_id: req.user.id };
        const job = await Job.findOne({ where: whereClause });

        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
            return;
        }

        job.status = status;
        await job.save();

        res.status(200).json({
            success: true,
            message: `Job status updated to ${status}`,
            data: job
        });
    } catch (error) {
        next(error);
    }
};

// 4. Get all active jobs (Publicly accessible for candidates)
export const getAllActiveJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobs = await Job.findAll({
            where: { status: 'Active' },
            order: [['created_at', 'DESC']],
            // Optionally include recruiter info here later if desired
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};

// 4.5. Get a single active job by ID (Publicly accessible for candidates)
export const getPublicJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ where: { id, status: 'Active' } });

        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found or not active.' });
            return;
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        next(error);
    }
};

// 5. Get job by ID (Recruiter only)
export const getJobById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAdmin = req.user?.type === 'admin';
        if (!req.user || (req.user.role !== 'recruiter' && !isAdmin)) {
            res.status(403).json({ success: false, message: 'Access denied.' });
            return;
        }

        const { id } = req.params;
        const whereClause = isAdmin ? { id } : { id, recruiter_id: req.user.id };
        const job = await Job.findOne({ where: whereClause });

        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        next(error);
    }
};

// 6. Update job details (Recruiter only)
export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAdmin = req.user?.type === 'admin';
        if (!req.user || (req.user.role !== 'recruiter' && !isAdmin)) {
            res.status(403).json({ success: false, message: 'Access denied.' });
            return;
        }

        const { id } = req.params;
        const updateData = req.body;

        const whereClause = isAdmin ? { id } : { id, recruiter_id: req.user.id };
        const job = await Job.findOne({ where: whereClause });

        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }

        // Update the job with the provided data
        await job.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: job
        });
    } catch (error) {
        next(error);
    }
};
