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

export const getIndustries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    const search = req.query.search as string | undefined;

    const industries = await lookupService.getIndustries(limit, offset, search);
    sendSuccess(res, industries, 'Industries retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const industry_id = req.query.industry_id ? parseInt(req.query.industry_id as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    const search = req.query.search as string | undefined;

    const categories = await lookupService.getCategories(industry_id, limit, offset, search);
    sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category_id = req.query.category_id ? parseInt(req.query.category_id as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    const search = req.query.search as string | undefined;

    const jobRoles = await lookupService.getJobRoles(category_id, limit, offset, search);
    sendSuccess(res, jobRoles, 'Job roles retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// CRUD Endpoints for Industries

export const getIndustryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const industry = await lookupService.getIndustryById(id);
    if (!industry) {
      res.status(404).json({ success: false, message: 'Industry not found' });
      return;
    }
    sendSuccess(res, industry, 'Industry retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createIndustry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const industry = await lookupService.createIndustry(req.body);
    sendSuccess(res, industry, 'Industry created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateIndustries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Support both single object and array of objects
    const data = Array.isArray(req.body) ? req.body : [req.body];
    if (data.length === 0) {
      res.status(400).json({ success: false, message: 'No data provided for update' });
      return;
    }
    const updatedIndustries = await lookupService.updateIndustries(data);
    sendSuccess(res, updatedIndustries, 'Industries updated successfully');
  } catch (error) {
    next(error);
  }
};

// CRUD Endpoints for Categories

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const category = await lookupService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    sendSuccess(res, category, 'Category retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await lookupService.createCategory(req.body);
    sendSuccess(res, category, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    if (data.length === 0) {
      res.status(400).json({ success: false, message: 'No data provided for update' });
      return;
    }
    const updatedCategories = await lookupService.updateCategories(data);
    sendSuccess(res, updatedCategories, 'Categories updated successfully');
  } catch (error) {
    next(error);
  }
};

// CRUD Endpoints for Job Roles

export const getJobRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const jobRole = await lookupService.getJobRoleById(id);
    if (!jobRole) {
      res.status(404).json({ success: false, message: 'Job role not found' });
      return;
    }
    sendSuccess(res, jobRole, 'Job role retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobRole = await lookupService.createJobRole(req.body);
    sendSuccess(res, jobRole, 'Job role created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateJobRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    if (data.length === 0) {
      res.status(400).json({ success: false, message: 'No data provided for update' });
      return;
    }
    const updatedJobRoles = await lookupService.updateJobRoles(data);
    sendSuccess(res, updatedJobRoles, 'Job roles updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE Endpoints

export const deleteIndustry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const deleted = await lookupService.deleteIndustry(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Industry not found' });
      return;
    }
    sendSuccess(res, null, 'Industry deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const deleted = await lookupService.deleteCategory(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const deleted = await lookupService.deleteJobRole(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Job role not found' });
      return;
    }
    sendSuccess(res, null, 'Job role deleted successfully');
  } catch (error) {
    next(error);
  }
};
