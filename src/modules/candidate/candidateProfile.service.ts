import CandidateModel from '../../models/candidateProfile.model';
import WorkExperienceModel from '../../models/workExperience.model';
import CandidateSkillModel from '../../models/candidateSkill.model';
import CandidateEducationModel from '../../models/candidateEducation.model';
import CandidateCertificationModel from '../../models/candidateCertification.model';
import { Candidate, CreateCandidateDTO, UpdateCandidateDTO, CandidateWithRelations } from './candidateTypes';
import { CreateWorkExperienceDTO, CreateSkillDTO, CreateCertificationDTO } from './workExperience.types';
import { sequelize } from '../../config/database';
import { handleServiceCall } from '../../utils/serviceHandlerUtil';
import { CANDIDATE_PROFILE_MESSAGES, CANDIDATE_STATUS, SORT_ORDER } from '../../constants/candidateProfile.constants';
import { Op } from 'sequelize';

/**
 * Get all candidate profiles with pagination
 */
export const getAllCandidates = async (page: number = 1, limit: number = 10, recruiterId?: string) => {
  return handleServiceCall(async () => {
    const offset = (page - 1) * limit;

    const findOptions: any = {
      limit,
      offset,
      order: [['created_at', SORT_ORDER.DESC]],
    };

    // If recruiterId is provided, join with JobApplication and Job to filter
    if (recruiterId) {
      const Recruiter = (await import('../../models/recruiter.model')).default;
      const IndustryModel = (await import('../../models/industry.model')).default;
      const { INDUSTRY_JOB_MAP } = await import('../../constants/industryMapping');

      const recruiter = await Recruiter.findByPk(recruiterId, {
        include: [{
          model: IndustryModel,
          as: 'industries',
          attributes: ['name']
        }]
      });

      if (recruiter) {
        let approvedIndustries = (recruiter as any).industries ? (recruiter as any).industries.map((ind: any) => ind.name) : [];
        
        // Fallback to pending_industries if no approved ones yet
        if (approvedIndustries.length === 0) {
          let pending = (recruiter as any).pending_industries || [];
          if (typeof pending === 'string') {
            try { pending = JSON.parse(pending); } catch (e) { pending = []; }
          }
          if (Array.isArray(pending) && pending.length > 0) {
            approvedIndustries = pending;
          }
        }

        if (approvedIndustries.length > 0) {
          // Expand the search to include all sub-roles from the INDUSTRY_JOB_MAP
          const expandedSearchTerms = new Set<string>();
          approvedIndustries.forEach((industry: string) => {
            expandedSearchTerms.add(industry); // Add parent
            if (INDUSTRY_JOB_MAP[industry]) {
              INDUSTRY_JOB_MAP[industry].forEach((role: string) => expandedSearchTerms.add(role));
            }
          });

          const searchTerms = Array.from(expandedSearchTerms);
          
          // Construct keywords for LIKE search as a further fallback
          const orConditions: any[] = [
            { preferred_industry: { [Op.in]: searchTerms } },
            { job_category: { [Op.in]: searchTerms } }
          ];

          // Add LIKE matches for each approved industry (e.g., if approved for "IT", also check roles containing "IT")
          approvedIndustries.forEach((industry: string) => {
            // Clean industry name for keyword search (e.g. remove " (IT)")
            const keyword = industry.replace(/\(.*\)/, '').trim();
            if (keyword.length > 2) {
              orConditions.push({ job_category: { [Op.like]: `%${keyword}%` } });
              orConditions.push({ preferred_industry: { [Op.like]: `%${keyword}%` } });
            }
          });

          findOptions.where = {
            ...findOptions.where,
            [Op.or]: orConditions
          };
        }
      }
    }

    const { count, rows } = await CandidateModel.findAndCountAll(findOptions);

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

    // Get education
    const education = await CandidateEducationModel.findAll({
      where: { candidate_id: id },
      order: [['passing_year', 'DESC']],
    });

    // Get certifications
    const certifications = await CandidateCertificationModel.findAll({
      where: { candidate_id: id },
    });

    const candidateData = candidate.toJSON() as CandidateWithRelations;
    candidateData.work_experience = workExperience.map(exp => exp.toJSON());
    candidateData.skills = skills.map(skill => skill.toJSON());
    candidateData.education = education.map(edu => edu.toJSON());
    candidateData.certifications = certifications.map(cert => cert.toJSON());

    candidateData.profile_completion_percentage = calculateProfileCompletion(candidateData);

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
      alternate_mobile_number: data.alternate_mobile_number,
      marital_status: data.marital_status,
      gender: data.gender ? (data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase()) as 'Male' | 'Female' | 'Other' : 'Male',
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
      address: data.address,
      country: data.country,
      state: data.state,
      district: data.district,
      city: data.city,
      village: data.village,
      position: data.position,
      experienced: data.experienced || false,
      fresher: data.fresher || false,
      expected_salary: data.expected_salary,
      expected_salary_min: data.expected_salary_min,
      expected_salary_max: data.expected_salary_max,
      total_experience_years: data.total_experience_years,
      job_category: data.job_category,
      preferred_industry: data.preferred_industry,
      current_location: data.current_location,
      interview_availability: data.interview_availability,
      availability_start: data.availability_start ? new Date(data.availability_start) : null,
      availability_end: data.availability_end ? new Date(data.availability_end) : null,
      preferred_shift: data.preferred_shift,
      summary: data.summary,
      additional_info: data.additional_info,
      pincode: data.pincode,
      languages_known: data.languages_known,
      pref_state: data.pref_state,
      pref_district: data.pref_district,
      pref_city: data.pref_city,
      pref_village: data.pref_village,
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

    // Insert education if provided
    if (data.education && Array.isArray(data.education)) {
      for (const edu of data.education) {
        await insertEducation(candidateId, edu, transaction);
      }
    }

    // Insert skills if provided
    if (data.skills && Array.isArray(data.skills)) {
      for (const skill of data.skills) {
        await insertSkill(candidateId, skill, transaction);
      }
    }

    // Insert certifications if provided
    if (data.certifications && Array.isArray(data.certifications)) {
      for (const cert of data.certifications) {
        await insertCertification(candidateId, cert, transaction);
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
    if (data.alternate_mobile_number !== undefined) updateData.alternate_mobile_number = data.alternate_mobile_number;
    if (data.marital_status !== undefined) updateData.marital_status = data.marital_status;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.date_of_birth !== undefined) updateData.date_of_birth = data.date_of_birth ? new Date(data.date_of_birth) : null;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.district !== undefined) updateData.district = data.district;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.village !== undefined) updateData.village = data.village;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.experienced !== undefined) updateData.experienced = data.experienced;
    if (data.fresher !== undefined) updateData.fresher = data.fresher;
    if (data.expected_salary !== undefined) updateData.expected_salary = data.expected_salary;
    if (data.expected_salary_min !== undefined) updateData.expected_salary_min = data.expected_salary_min;
    if (data.expected_salary_max !== undefined) updateData.expected_salary_max = data.expected_salary_max;
    if (data.total_experience_years !== undefined) updateData.total_experience_years = data.total_experience_years;
    if (data.job_category !== undefined) updateData.job_category = data.job_category;
    if (data.preferred_industry !== undefined) updateData.preferred_industry = data.preferred_industry;
    if (data.current_location !== undefined) updateData.current_location = data.current_location;
    if (data.interview_availability !== undefined) updateData.interview_availability = data.interview_availability;
    if (data.availability_start !== undefined) updateData.availability_start = data.availability_start ? new Date(data.availability_start) : null;
    if (data.availability_end !== undefined) updateData.availability_end = data.availability_end ? new Date(data.availability_end) : null;
    if (data.availability_end !== undefined) updateData.availability_end = data.availability_end ? new Date(data.availability_end) : null;
    if (data.preferred_shift !== undefined) updateData.preferred_shift = data.preferred_shift;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.additional_info !== undefined) updateData.additional_info = data.additional_info;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.languages_known !== undefined) updateData.languages_known = data.languages_known;
    if (data.pref_state !== undefined) updateData.pref_state = data.pref_state;
    if (data.pref_district !== undefined) updateData.pref_district = data.pref_district;
    if (data.pref_city !== undefined) updateData.pref_city = data.pref_city;
    if (data.pref_village !== undefined) updateData.pref_village = data.pref_village;
    if (data.status !== undefined) updateData.status = data.status;

    await candidate.update(updateData, { transaction });

    // Update related arrays
    if (data.work_experience !== undefined) {
      await WorkExperienceModel.destroy({ where: { candidate_id: id }, transaction });
      if (Array.isArray(data.work_experience) && data.work_experience.length > 0) {
        const weToCreate = data.work_experience.map((we: any) => ({ ...we, candidate_id: id }));
        await WorkExperienceModel.bulkCreate(weToCreate, { transaction });
      }
    }

    if (data.skills !== undefined) {
      await CandidateSkillModel.destroy({ where: { candidate_id: id }, transaction });
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        const skillsToCreate = data.skills.map((s: any) => ({ ...s, candidate_id: id }));
        await CandidateSkillModel.bulkCreate(skillsToCreate, { transaction });
      }
    }

    if (data.education !== undefined) {
      await CandidateEducationModel.destroy({ where: { candidate_id: id }, transaction });
      if (Array.isArray(data.education) && data.education.length > 0) {
        const eduToCreate = data.education.map((e: any) => ({ ...e, candidate_id: id }));
        await CandidateEducationModel.bulkCreate(eduToCreate, { transaction });
      }
    }

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
    await CandidateEducationModel.destroy({ where: { candidate_id: id }, transaction });
    await CandidateCertificationModel.destroy({ where: { candidate_id: id }, transaction });

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
    current_wages: data.current_wages || null,
    current_state: data.current_state || '',
    current_city: data.current_city || '',
    current_village: data.current_village || '',
    is_current: data.is_current || false,
  };

  // If is_current is true, end_date must be null
  if (experienceData.is_current) {
    experienceData.end_date = null;
  }

  return await WorkExperienceModel.create(experienceData, { transaction });
}

async function insertSkill(candidateId: string, data: any, transaction: any) {
  const rawYears = typeof data === 'object' ? (data.years_of_experience ?? null) : null;
  const skillData: any = {
    candidate_id: candidateId,
    skill_name: typeof data === 'string' ? data : (data.skill_name || ''),
    years_of_experience: rawYears !== '' && rawYears !== null ? Number(rawYears) || null : null,
    level: typeof data === 'object' ? (data.level || '') : '',
  };

  return await CandidateSkillModel.create(skillData, { transaction });
}

async function insertEducation(candidateId: string, data: any, transaction: any) {
  const educationData: any = {
    candidate_id: candidateId,
    degree: data.degree || '',
    university: data.university || '',
    passing_year: data.passing_year || data.passingYear || '',
  };

  return await CandidateEducationModel.create(educationData, { transaction });
}

async function insertCertification(candidateId: string, data: CreateCertificationDTO, transaction: any) {
  const certificationData: any = {
    candidate_id: candidateId,
    name: data.name || '',
    year: data.year || '',
    achievement: data.achievement || '',
  };

  return await CandidateCertificationModel.create(certificationData, { transaction });
}

export function calculateProfileCompletion(candidate: CandidateWithRelations): number {
  let score = 0;

  // 1. Basic Info (25%)
  if (candidate.full_name) score += 5;
  if (candidate.email) score += 5;
  if (candidate.mobile_number) score += 5;
  if (candidate.gender) score += 5;
  if (candidate.date_of_birth) score += 5;

  // 2. Address (15%)
  if (candidate.city) score += 5;
  if (candidate.state) score += 5;
  if (candidate.country) score += 5;

  // 3. Professional Info (15%)
  if (candidate.job_category) score += 5;
  if (candidate.expected_salary || (candidate.expected_salary_min && candidate.expected_salary_max)) score += 5;
  if (candidate.total_experience_years !== undefined || candidate.experienced || candidate.fresher) score += 5;

  // 4. Resume (15%)
  if (candidate.resume) score += 15;

  // 5. Profile Photo (10%)
  if (candidate.profile_photo) score += 10;

  // 6. Education (10%)
  if (candidate.education && candidate.education.length > 0) score += 10;

  // 7. Skills (10%)
  if (candidate.skills && candidate.skills.length > 0) score += 10;

  // 8. Work Experience (10%)
  if (candidate.work_experience && candidate.work_experience.length > 0) score += 10;

  return Math.min(100, score);
}
