export interface Country {
  id: number;
  countryCode: string;
  name: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}

export interface JobFunction {
  id: number;
  job_function_name: string;
  status: 'Active' | 'Inactive';
}

export interface JobSkill {
  id: number;
  skill_name: string;
  status: 'Active' | 'Inactive';
}

export interface Industry {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
}

export interface Category {
  id: number;
  industry_id: number;
  name: string;
  created_at: Date;
}

export interface JobRole {
  id: number;
  category_id: number;
  name: string;
  created_at: Date;
}
