import { Request, Response, NextFunction } from 'express';
import * as lookupService from './lookup.service';
import { sendSuccess } from '../../utils/responseUtil';

export const getCountries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const countries = await lookupService.getCountries();
    sendSuccess(res, countries, 'Countries retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getStates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const country_id = req.query.country_id ? parseInt(req.query.country_id as string) : undefined;
    const states = await lookupService.getStates(country_id);
    sendSuccess(res, states, 'States retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const state_id = req.query.state_id ? parseInt(req.query.state_id as string) : undefined;
    const cities = await lookupService.getCities(state_id);
    sendSuccess(res, cities, 'Cities retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getJobFunctions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobFunctions = await lookupService.getJobFunctions();
    sendSuccess(res, jobFunctions, 'Job functions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getJobSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobSkills = await lookupService.getJobSkills();
    sendSuccess(res, jobSkills, 'Job skills retrieved successfully');
  } catch (error) {
    next(error);
  }
};
