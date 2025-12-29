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
