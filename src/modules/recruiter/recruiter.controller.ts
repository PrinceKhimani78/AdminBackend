import { Request, Response, NextFunction } from 'express';
import Recruiter from '../../models/recruiter.model';
import IndustryModel from '../../models/industry.model';
import { sequelize } from '../../config/database';
import { Op } from 'sequelize';
import RecruiterIndustry from '../../models/recruiterIndustry.model';

export const getPendingRecruiters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiters = await Recruiter.findAll({
            where: { status: 'PendingApproval' },
            order: [['created_at', 'DESC']]
        });
        const formatted = recruiters.map((r: any) => {
            let pending = r.pending_industries;
            if (typeof pending === 'string') {
                try { pending = JSON.parse(pending); } catch (e) { pending = []; }
            }
            return {
                ...r.toJSON(),
                pending_industries: Array.isArray(pending) ? pending : []
            };
        });
        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        next(error);
    }
};

export const approveRecruiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findByPk(id, { transaction });

        if (!recruiter) {
            await transaction.rollback();
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        // 1. Activate the account
        recruiter.status = 'Active';

        // 2. Auto-approve all pending industries into the junction table
        let pending = (recruiter as any).pending_industries || [];
        if (typeof pending === 'string') {
            try { pending = JSON.parse(pending); } catch (e) { pending = []; }
        }
        if (!Array.isArray(pending)) pending = [];

        for (const industryName of pending as string[]) {
            if (!industryName) continue;
            // Find or create the industry
            let industry = await IndustryModel.findOne({ where: { name: industryName }, transaction });
            if (!industry) {
                const slug = industryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                industry = await IndustryModel.create({ name: industryName, slug }, { transaction });
            }
            // Link recruiter ↔ industry (ignore duplicates)
            const existing = await RecruiterIndustry.findOne({
                where: { recruiter_id: id, industry_id: industry.id },
                transaction
            });
            if (!existing) {
                await RecruiterIndustry.create({ recruiter_id: id, industry_id: industry.id }, { transaction });
            }
        }

        // 3. Clear pending_industries
        (recruiter as any).pending_industries = [];
        await recruiter.save({ transaction });

        await transaction.commit();
        res.status(200).json({ success: true, message: 'Recruiter approved successfully' });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

export const rejectRecruiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findByPk(id);

        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        recruiter.status = 'Inactive';
        await recruiter.save();

        res.status(200).json({ success: true, message: 'Recruiter rejected successfully' });
    } catch (error) {
        next(error);
    }
};

export const requestIndustry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiterId = (req as any).user.id;
        const { industryName } = req.body;

        const recruiter = await Recruiter.findByPk(recruiterId);
        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        let pending = (recruiter as any).pending_industries || [];
        if (typeof pending === 'string') {
            try { pending = JSON.parse(pending); } catch (e) { pending = []; }
        }
        if (!Array.isArray(pending)) pending = [];

        if (!pending.includes(industryName)) {
            pending.push(industryName);
            (recruiter as any).pending_industries = pending;
            await recruiter.save();
        }

        res.status(200).json({ success: true, message: 'Industry request submitted' });
    } catch (error) {
        next(error);
    }
};

export const getPendingIndustries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiters = await Recruiter.findAll({
            where: {
                [Op.and]: [
                    { pending_industries: { [Op.ne]: null } }
                ]
            },
            attributes: ['id', 'full_name', 'company_name', 'pending_industries']
        });
        const formatted = recruiters.map((r: any) => {
            let pending = r.pending_industries;
            if (typeof pending === 'string') {
                try { pending = JSON.parse(pending); } catch (e) { pending = []; }
            }
            return {
                ...r.get({ plain: true }),
                pending_industries: Array.isArray(pending) ? pending : []
            };
        }).filter(r => r.pending_industries.length > 0);
        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        next(error);
    }
};

export const getAllRecruiterIndustries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiters = await Recruiter.findAll({
            include: [{
                model: IndustryModel,
                as: 'industries',
                attributes: ['id', 'name']
            }],
            attributes: ['id', 'full_name', 'company_name', 'email', 'pending_industries', 'denied_industries']
        });

        const parseJSON = (val: any) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return []; }
            }
            return Array.isArray(val) ? val : [];
        };

        const formatted = recruiters.map((r: any) => ({
            id: r.id,
            full_name: r.full_name,
            company_name: r.company_name,
            email: r.email,
            approved_industries: r.industries || [],
            pending_industries: parseJSON(r.pending_industries),
            denied_industries: parseJSON(r.denied_industries)
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        next(error);
    }
};

export const approveIndustry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
        const { recruiterId, industryName } = req.body;

        const recruiter = await Recruiter.findByPk(recruiterId, { transaction });
        if (!recruiter) {
            await transaction.rollback();
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        // 1. Find or create industry in IndustryModel if it's a new name
        // (Assuming standard industries exist, but if it's custom we might need to handle)
        let industry = await IndustryModel.findOne({ where: { name: industryName }, transaction });
        if (!industry) {
            const slug = industryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            industry = await IndustryModel.create({ name: industryName, slug }, { transaction });
        }

        // 2. Add to junction table
        await RecruiterIndustry.create({
            recruiter_id: recruiterId,
            industry_id: industry.id
        }, { transaction });

        // 3. Remove from pending
        let pending = (recruiter as any).pending_industries || [];
        if (typeof pending === 'string') {
            try { pending = JSON.parse(pending); } catch (e) { pending = []; }
        }
        if (!Array.isArray(pending)) pending = [];
        
        (recruiter as any).pending_industries = (pending as string[]).filter(i => i !== industryName);
        await recruiter.save({ transaction });

        await transaction.commit();
        res.status(200).json({ success: true, message: 'Industry approved and linked' });
    } catch (error) {
        await transaction.rollback();
        console.error('❌ ERROR in approveIndustry:', error);
        next(error);
    }
};

export const removeApprovedIndustry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { recruiterId, industryName } = req.body;

        const recruiter = await Recruiter.findByPk(recruiterId);
        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        const industry = await IndustryModel.findOne({ where: { name: industryName } });
        if (!industry) {
            res.status(404).json({ success: false, message: 'Industry not found' });
            return;
        }

        await RecruiterIndustry.destroy({
            where: {
                recruiter_id: recruiterId,
                industry_id: industry.id
            }
        });

        res.status(200).json({ success: true, message: 'Approved industry removed successfully' });
    } catch (error) {
        console.error('❌ ERROR in removeApprovedIndustry:', error);
        next(error);
    }
};

export const rejectIndustry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { recruiterId, industryName } = req.body;

        const recruiter = await Recruiter.findByPk(recruiterId);
        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        // 1. Remove from pending
        let pending = (recruiter as any).pending_industries || [];
        if (typeof pending === 'string') {
            try { pending = JSON.parse(pending); } catch (e) { pending = []; }
        }
        if (!Array.isArray(pending)) pending = [];
        (recruiter as any).pending_industries = (pending as string[]).filter(i => i !== industryName);

        // 2. Add to denied
        let denied = (recruiter as any).denied_industries || [];
        if (typeof denied === 'string') {
            try { denied = JSON.parse(denied); } catch (e) { denied = []; }
        }
        if (!Array.isArray(denied)) denied = [];

        if (!denied.includes(industryName)) {
            denied.push(industryName);
            (recruiter as any).denied_industries = denied;
        }

        await recruiter.save();
        res.status(200).json({ success: true, message: 'Industry request rejected' });
    } catch (error) {
        next(error);
    }
};

export const getRecruiterProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiterId = (req as any).user.id;
        const recruiter = await Recruiter.findByPk(recruiterId, {
            include: [{
                model: IndustryModel,
                as: 'industries',
                attributes: ['id', 'name']
            }]
        });

        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        const data = recruiter.get({ plain: true });
        
        // Ensure arrays are arrays
        const parseJSON = (val: any) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return []; }
            }
            return Array.isArray(val) ? val : [];
        };

        const formatted = {
            ...data,
            pending_industries: parseJSON(data.pending_industries),
            denied_industries: parseJSON(data.denied_industries),
            industries: data.industries || []
        };

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        next(error);
    }
};

export const updateRecruiterProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiterId = (req as any).user.id;
        const { companyName, phone } = req.body;

        const recruiter = await Recruiter.findByPk(recruiterId);
        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        if (companyName) recruiter.company_name = companyName;
        if (phone) recruiter.mobile_number = phone;

        await recruiter.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully', data: recruiter });
    } catch (error) {
        next(error);
    }
};

export const getRecruiterStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiterId = (req as any).user.id;
        
        const Job = (await import('../../models/job.model')).default;
        const JobApplication = (await import('../../models/jobApplication.model')).default;
        const CandidateProfile = (await import('../../models/candidateProfile.model')).default;
        const IndustryModel = (await import('../../models/industry.model')).default;

        // 1. Total Posted Jobs
        const postedJobsCount = await Job.count({ where: { recruiter_id: recruiterId } });

        // 2. New Applications (count with status 'Applied')
        const newApplicationsCount = await JobApplication.count({
            where: { status: 'Applied' },
            include: [{
                model: Job,
                required: true,
                where: { recruiter_id: recruiterId }
            }]
        });

        // 3. Total Candidates (filtered by recruiter's industries)
        const recruiter = await Recruiter.findByPk(recruiterId, {
            include: [{
                model: IndustryModel,
                as: 'industries',
                attributes: ['name']
            }]
        });

        let totalCandidates = 0;
        if (recruiter && (recruiter as any).industries && (recruiter as any).industries.length > 0) {
            const approvedIndustries = (recruiter as any).industries.map((ind: any) => ind.name);
            totalCandidates = await CandidateProfile.count({
                where: {
                    job_category: { [Op.in]: approvedIndustries }
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                postedJobs: postedJobsCount,
                newApplications: newApplicationsCount,
                totalCandidates: totalCandidates,
                messages: 0 // Placeholder
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getRecentApplicants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recruiterId = (req as any).user.id;
        
        const Job = (await import('../../models/job.model')).default;
        const JobApplication = (await import('../../models/jobApplication.model')).default;
        const CandidateProfile = (await import('../../models/candidateProfile.model')).default;

        const applications = await JobApplication.findAll({
            limit: 5,
            order: [['applied_at', 'DESC']],
            include: [
                {
                    model: Job,
                    required: true,
                    where: { recruiter_id: recruiterId },
                    attributes: ['id', 'title']
                },
                {
                    model: CandidateProfile,
                    required: true,
                    attributes: ['id', 'full_name', 'current_job_role', 'location', 'profile_photo']
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRecruiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findByPk(id);
        if (!recruiter) {
            res.status(404).json({ success: false, message: 'Recruiter not found' });
            return;
        }

        await recruiter.destroy();

        res.status(200).json({
            success: true,
            message: 'Recruiter deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
