import CandidateModel from '../../models/candidateProfile.model';
import WorkExperienceModel from '../../models/workExperience.model';
import CandidateSkillModel from '../../models/candidateSkill.model';
import { Candidate, CreateCandidateDTO, UpdateCandidateDTO, CandidateWithRelations } from './candidateTypes';
import { CreateWorkExperienceDTO, CreateSkillDTO } from './workExperience.types';
import { sequelize } from '../../config/database';
import { handleServiceCall } from '../../utils/serviceHandlerUtil';
import { CANDIDATE_PROFILE_MESSAGES, CANDIDATE_STATUS, SORT_ORDER } from '../../constants/candidateProfile.constants';

/**
 * Get all candidate profiles with pagination
 */
export const getAllCandidates = async (page: number = 1, limit: number = 10) => {
  return handleServiceCall(async () => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await CandidateModel.findAndCountAll({
      limit,
      offset,
      order: [['created_at', SORT_ORDER.DESC]],
    });
    
    return {
      profiles: rows,
      pagination: {
        current_page: page,
        per_page: limit,
        total: count,
        total_pages: Math.ceil(count / limit),
      },
    };
  });
};

/**
 * Get single candidate profile with work experience and skills
 */
export const getCandidateById = async (id: string): Promise<CandidateWithRelations | null> => {
  return handleServiceCall(async () => {
    const candidate = await CandidateModel.findByPk(id);
    
    if (!candidate) {
      return null;
    }
    
    // Get work experience
    const workExperience = await WorkExperienceModel.findAll({
      where: { candidate_id: id },
      order: [['start_date', SORT_ORDER.DESC]],
    });
    
    // Get skills
    const skills = await CandidateSkillModel.findAll({
      where: { candidate_id: id },
    });
    
    const candidateData = candidate.toJSON() as CandidateWithRelations;
    candidateData.work_experience = workExperience.map(exp => exp.toJSON());
    candidateData.skills = skills.map(skill => skill.toJSON());
    
    return candidateData;
  });
};

/**
 * Create new candidate profile with work experience and skills
 */
export const createCandidate = async (data: CreateCandidateDTO, ip_address?: string): Promise<string> => {
  // Check if email exists BEFORE starting transaction
  const existing = await CandidateModel.findOne({
    where: { email: data.email },
  });
  
  if (existing) {
    throw new Error(CANDIDATE_PROFILE_MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    
    // Prepare candidate data
    const candidateData: any = {
      full_name: data.full_name,
      surname: data.surname,
      email: data.email,
      mobile_number: data.mobile_number,
      gender: data.gender ? (data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase()) as 'Male' | 'Female' | 'Other' : 'Male',
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      position: data.position,
      experienced: data.experienced || false,
      fresher: data.fresher || false,
      expected_salary: data.expected_salary,
      job_category: data.job_category,
      current_location: data.current_location,
      interview_availability: data.interview_availability,
      availability_start: data.availability_start ? new Date(data.availability_start) : null,
      availability_end: data.availability_end ? new Date(data.availability_end) : null,
      preferred_shift: data.preferred_shift,
      ip_address: ip_address,
      status: CANDIDATE_STATUS.ACTIVE,
    };
    
    // Create candidate
    const candidate = await CandidateModel.create(candidateData, { transaction });
    const candidateId = candidate.id;
    
    // Insert work experience if provided
    if (data.work_experience && Array.isArray(data.work_experience)) {
      for (const exp of data.work_experience) {
        await insertWorkExperience(candidateId, exp, transaction);
      }
    }
    
    // Insert skills if provided
    if (data.skills && Array.isArray(data.skills)) {
      for (const skill of data.skills) {
        await insertSkill(candidateId, skill, transaction);
      }
    }
    
    await transaction.commit();
    return candidateId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Update candidate profile
 */
export const updateCandidate = async (id: string, data: UpdateCandidateDTO): Promise<boolean> => {
  const transaction = await sequelize.transaction();
  
  try {
    const candidate = await CandidateModel.findByPk(id, { transaction });
    
    if (!candidate) {
      await transaction.rollback();
      return false;
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.surname !== undefined) updateData.surname = data.surname;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.mobile_number !== undefined) updateData.mobile_number = data.mobile_number;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.date_of_birth !== undefined) updateData.date_of_birth = data.date_of_birth ? new Date(data.date_of_birth) : null;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.experienced !== undefined) updateData.experienced = data.experienced;
    if (data.fresher !== undefined) updateData.fresher = data.fresher;
    if (data.expected_salary !== undefined) updateData.expected_salary = data.expected_salary;
    if (data.job_category !== undefined) updateData.job_category = data.job_category;
    if (data.current_location !== undefined) updateData.current_location = data.current_location;
    if (data.interview_availability !== undefined) updateData.interview_availability = data.interview_availability;
    if (data.availability_start !== undefined) updateData.availability_start = data.availability_start ? new Date(data.availability_start) : null;
    if (data.availability_end !== undefined) updateData.availability_end = data.availability_end ? new Date(data.availability_end) : null;
    if (data.preferred_shift !== undefined) updateData.preferred_shift = data.preferred_shift;
    if (data.status !== undefined) updateData.status = data.status;
    
    await candidate.update(updateData, { transaction });
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Delete candidate profile (cascade delete work experience and skills)
 */
export const deleteCandidate = async (id: string): Promise<boolean> => {
  const transaction = await sequelize.transaction();
  
  try {
    const candidate = await CandidateModel.findByPk(id, { transaction });
    
    if (!candidate) {
      await transaction.rollback();
      return false;
    }
    
    // Delete related records
    await WorkExperienceModel.destroy({ where: { candidate_id: id }, transaction });
    await CandidateSkillModel.destroy({ where: { candidate_id: id }, transaction });
    
    // Delete candidate
    await candidate.destroy({ transaction });
    
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Update candidate files (profile_photo and/or resume)
 * Deletes old files asynchronously to avoid blocking
 */
export const updateCandidateFiles = async (
  id: string,
  files: { profile_photo?: string; resume?: string }
): Promise<boolean> => {
  return handleServiceCall(async () => {
    const candidate = await CandidateModel.findByPk(id);
    
    if (!candidate) {
      return false;
    }
    
    // Get old file paths for deletion
    const oldFiles: string[] = [];
    if (files.profile_photo && candidate.profile_photo) {
      oldFiles.push(candidate.profile_photo);
    }
    if (files.resume && candidate.resume) {
      oldFiles.push(candidate.resume);
    }
    
    const updateData: any = {};
    if (files.profile_photo) updateData.profile_photo = files.profile_photo;
    if (files.resume) updateData.resume = files.resume;
    
    await candidate.update(updateData);
    
    // Delete old files asynchronously (non-blocking)
    if (oldFiles.length > 0) {
      const { deleteOldFile } = await import('../../middleware/upload.middleware');
      Promise.all(oldFiles.map(file => deleteOldFile(file))).catch(err => {
        console.error('Error deleting old files:', err);
      });
    }
    
    return true;
  });
};

export const getCandidateDocuments = async (candidateId: string) => {
  return handleServiceCall(async () => {
    const candidate = await CandidateModel.findByPk(candidateId, {
      attributes: ['id', 'full_name', 'profile_photo', 'resume'],
    });
    
    if (!candidate) {
      return null;
    }
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    return {
      profile_photo: {
        path: candidate.profile_photo,
        url: candidate.profile_photo ? `${baseUrl}/uploads/profile_photo/${candidate.profile_photo}` : null,
        exists: !!candidate.profile_photo,
      },
      resume: {
        path: candidate.resume,
        url: candidate.resume ? `${baseUrl}/uploads/resume/${candidate.resume}` : null,
        exists: !!candidate.resume,
      },
    };
  });
};

// Helper functions

async function insertWorkExperience(candidateId: string, data: any, transaction: any) {
  const experienceData: any = {
    candidate_id: candidateId,
    position: data.position || '',
    company: data.company || '',
    start_date: data.start_date ? new Date(data.start_date) : null,
    end_date: data.end_date ? new Date(data.end_date) : null,
    salary_period: data.salary_period || '',
    is_current: data.is_current || false,
  };
  
  // If is_current is true, end_date must be null
  if (experienceData.is_current) {
    experienceData.end_date = null;
  }
  
  return await WorkExperienceModel.create(experienceData, { transaction });
}

async function insertSkill(candidateId: string, data: any, transaction: any) {
  const skillData: any = {
    candidate_id: candidateId,
    skill_name: typeof data === 'string' ? data : (data.skill_name || ''),
    years_of_experience: typeof data === 'object' ? (data.years_of_experience || '') : '',
  };
  
  return await CandidateSkillModel.create(skillData, { transaction });
}
