import { Router } from 'express';
import * as lookupController from './lookup.controller';
import { checkValidation } from '../../middleware/inputValidator';
import * as validator from './lookup.validator';

const router = Router();

// Lookup routes (existing)
router.get('/countries', lookupController.getCountries);
router.get('/states', lookupController.getStates); // Optional query param: country_id
router.get('/cities', lookupController.getCities); // Optional query param: state_id
router.get('/job-functions', lookupController.getJobFunctions);
router.get('/job-skills', lookupController.getJobSkills);

// Industries
router.get('/industries', validator.validateIndustryQuery, checkValidation, lookupController.getIndustries);
router.get('/industries/:id', validator.validateIdParam, checkValidation, lookupController.getIndustryById);
router.post('/industries', validator.validateCreateIndustry, checkValidation, lookupController.createIndustry);
router.put('/industries', validator.validateUpdateIndustries, checkValidation, lookupController.updateIndustries);
router.delete('/industries/:id', validator.validateIdParam, checkValidation, lookupController.deleteIndustry);

// Categories
router.get('/categories', validator.validateCategoryQuery, checkValidation, lookupController.getCategories);
router.get('/categories/:id', validator.validateIdParam, checkValidation, lookupController.getCategoryById);
router.post('/categories', validator.validateCreateCategory, checkValidation, lookupController.createCategory);
router.put('/categories', validator.validateUpdateCategories, checkValidation, lookupController.updateCategories);
router.delete('/categories/:id', validator.validateIdParam, checkValidation, lookupController.deleteCategory);

// Job Roles
router.get('/job-roles', validator.validateJobRoleQuery, checkValidation, lookupController.getJobRoles);
router.get('/job-roles/:id', validator.validateIdParam, checkValidation, lookupController.getJobRoleById);
router.post('/job-roles', validator.validateCreateJobRole, checkValidation, lookupController.createJobRole);
router.put('/job-roles', validator.validateUpdateJobRoles, checkValidation, lookupController.updateJobRoles);
router.delete('/job-roles/:id', validator.validateIdParam, checkValidation, lookupController.deleteJobRole);

export default router;
