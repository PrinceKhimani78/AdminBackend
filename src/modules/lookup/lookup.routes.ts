import { Router } from 'express';
import * as lookupController from './lookup.controller';

const router = Router();

// Lookup routes
router.get('/countries', lookupController.getCountries);
router.get('/states', lookupController.getStates); // Optional query param: country_id
router.get('/cities', lookupController.getCities); // Optional query param: state_id
router.get('/job-functions', lookupController.getJobFunctions);
router.get('/job-skills', lookupController.getJobSkills);

export default router;
