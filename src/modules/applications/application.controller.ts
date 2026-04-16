import { Request, Response, NextFunction } from 'express';
import JobApplication from '../../models/jobApplication.model';
import Job from '../../models/job.model';
import CandidateProfile from '../../models/candidateProfile.model';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/apply
 * @access  Private (Candidate)
 */
export const applyJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let { jobId, screeningAnswers } = req.body;
        const candidateId = (req as any).user.id;

        // Multer might make req.body fields as strings if using multipart/form-data
        if (typeof screeningAnswers === 'string') {
            try {
                screeningAnswers = JSON.parse(screeningAnswers);
            } catch (e) {
                // Not JSON, keep as is
            }
        }

        // 1. Check if job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }

        // 2. Check if already applied
        const existingApplication = await JobApplication.findOne({
            where: { job_id: jobId, candidate_id: candidateId }
        });

        if (existingApplication) {
            res.status(409).json({ success: false, message: 'You have already applied for this job' });
            return;
        }

        // 3. Create application
        const application = await JobApplication.create({
            id: uuidv4(),
            job_id: jobId,
            candidate_id: candidateId,
            status: 'Applied',
            applied_at: new Date(),
            screening_answers: screeningAnswers ? JSON.stringify(screeningAnswers) : null,
            resume: req.file ? req.file.filename : null
        });

        res.status(201).json({
            success: true,
            message: 'Applied successfully',
            data: application
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all applications for the logged-in candidate
 * @route   GET /api/applications/my-applications
 * @access  Private (Candidate)
 */
export const getMyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const candidateId = (req as any).user.id;

        const applications = await JobApplication.findAll({
            where: { candidate_id: candidateId },
            include: [
                {
                    model: Job,
                    attributes: ['id', 'title', 'company_name', 'location', 'salary_min', 'salary_max', 'job_role']
                }
            ],
            order: [['applied_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check status of a specific job application for current candidate
 * @route   GET /api/applications/check/:jobId
 * @access  Private (Candidate)
 */
export const checkApplicationStatus = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const { jobId } = req.params;
        const candidateId = (req as any).user.id;

        const application = await JobApplication.findOne({
            where: { job_id: jobId, candidate_id: candidateId },
            attributes: ['id', 'status', 'applied_at']
        });

        res.status(200).json({ 
            success: true, 
            applied: !!application,
            data: application 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all applicants for a specific job (Recruiter only)
 * @route   GET /api/applications/job/:jobId/applicants
 * @access  Private (Recruiter)
 */
export const getJobApplicants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { jobId } = req.params;
        const recruiterId = (req as any).user.id;

        // Verify the job belongs to this recruiter
        const job = await Job.findOne({ where: { id: jobId, recruiter_id: recruiterId } });
        if (!job) {
            res.status(403).json({ success: false, message: 'You are not authorized to view applicants for this job' });
            return;
        }

        const applicants = await JobApplication.findAll({
            where: { job_id: jobId },
            attributes: ['id', 'status', 'applied_at', 'screening_answers', 'resume', 'candidate_id'],
            include: [
                {
                    model: CandidateProfile,
                    as: 'Candidate',
                    attributes: ['id', 'full_name', 'email', 'mobile_number', 'position', 'city', 'state', 'profile_photo']
                }
            ],
            order: [['applied_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: applicants });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update application status (Recruiter only)
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Recruiter)
 */
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const recruiterId = (req as any).user.id;

        const application = await JobApplication.findByPk(id, {
            include: [{ model: Job }]
        });

        if (!application) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }

        // Verify the job belongs to this recruiter
        if ((application as any).Job.recruiter_id !== recruiterId) {
            res.status(403).json({ success: false, message: 'You are not authorized to update this application' });
            return;
        }

        application.status = status;
        await application.save();

        res.status(200).json({ success: true, message: 'Status updated successfully', data: application });
    } catch (error) {
        next(error);
    }
};
