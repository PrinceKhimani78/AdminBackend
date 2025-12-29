export interface WorkExperience {
  id: string;
  candidate_id: string;
  position: string;
  company: string;
  start_date: Date | null;
  end_date: Date | null;
  salary_period: string;
  is_current: boolean;
  created_at?: Date;
}

export interface CreateWorkExperienceDTO {
  position: string;
  company: string;
  start_date?: string;
  end_date?: string;
  salary_period?: string;
  is_current?: boolean;
}

export interface CandidateSkill {
  id: string;
  candidate_id: string;
  skill_name: string;
  years_of_experience: string;
  created_at?: Date;
}

export interface CreateSkillDTO {
  skill_name: string;
  years_of_experience?: string;
}
