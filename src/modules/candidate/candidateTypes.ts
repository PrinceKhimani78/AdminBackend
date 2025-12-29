export interface Candidate {
  id: string;
  full_name: string;
  surname?: string;
  email: string;
  mobile_number: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth?: Date | null;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  position?: string;
  experienced?: boolean;
  fresher?: boolean;
  expected_salary?: string;
  job_category?: string;
  current_location?: string;
  interview_availability?: string;
  availability_start?: Date | null;
  availability_end?: Date | null;
  preferred_shift?: string;
  profile_photo?: string;
  resume?: string;
  ip_address?: string;
  status: 'Active' | 'Inactive';
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateCandidateDTO {
  full_name: string;
  surname?: string;
  email: string;
  mobile_number: string;
  gender?: 'Male' | 'Female' | 'Other';
  date_of_birth?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  position?: string;
  experienced?: boolean;
  fresher?: boolean;
  expected_salary?: string;
  job_category?: string;
  current_location?: string;
  interview_availability?: string;
  availability_start?: string;
  availability_end?: string;
  preferred_shift?: string;
  work_experience?: any[];
  skills?: any[];
}

export interface UpdateCandidateDTO {
  full_name?: string;
  surname?: string;
  email?: string;
  mobile_number?: string;
  gender?: 'Male' | 'Female' | 'Other';
  date_of_birth?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  position?: string;
  experienced?: boolean;
  fresher?: boolean;
  expected_salary?: string;
  job_category?: string;
  current_location?: string;
  interview_availability?: string;
  availability_start?: string;
  availability_end?: string;
  preferred_shift?: string;
  status?: 'Active' | 'Inactive';
}

export interface CandidateWithRelations extends Candidate {
  work_experience?: any[];
  skills?: any[];
}
