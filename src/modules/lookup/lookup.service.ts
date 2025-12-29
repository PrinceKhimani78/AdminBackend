import CountryModel from '../../models/country.model';
import StateModel from '../../models/state.model';
import CityModel from '../../models/city.model';
import JobFunctionModel from '../../models/jobFunction.model';
import JobSkillModel from '../../models/jobSkill.model';
import { Country, State, City, JobFunction, JobSkill } from './lookup.types';
import { handleServiceCall } from '../../utils/serviceHandlerUtil';

export const getCountries = async (): Promise<Country[]> => {
  return handleServiceCall(async () => {
    return await CountryModel.findAll({ order: [['name', 'ASC']] });
  });
};

export const getStates = async (country_id?: number): Promise<State[]> => {
  return handleServiceCall(async () => {
    const where = country_id ? { country_id } : {};
    return await StateModel.findAll({ where, order: [['name', 'ASC']] });
  });
};

export const getCities = async (state_id?: number): Promise<City[]> => {
  return handleServiceCall(async () => {
    const where = state_id ? { state_id } : {};
    return await CityModel.findAll({ where, order: [['name', 'ASC']] });
  });
};

export const getJobFunctions = async (): Promise<JobFunction[]> => {
  return handleServiceCall(async () => {
    return await JobFunctionModel.findAll({ where: { status: 'Active' } });
  });
};

export const getJobSkills = async (): Promise<JobSkill[]> => {
  return handleServiceCall(async () => {
    return await JobSkillModel.findAll({ where: { status: 'Active' } });
  });
};
