import Joi from 'joi';
import { VALIDATION_MESSAGES } from '../../constants';

export const createCandidateProfileSchema = Joi.object({
  full_name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 255 characters',
      'any.required': 'Full name is required',
    }),

  surname: Joi.string()
    .max(255)
    .allow('')
    .optional(),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),

  mobile_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be 10-15 digits',
      'any.required': 'Mobile number is required',
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other', 'male', 'female', 'other')
    .optional()
    .messages({
      'any.only': 'Gender must be Male, Female, or Other',
    }),

  marital_status: Joi.string()
    .max(50)
    .optional()
    .allow(''),

  alternate_mobile_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(''),

  date_of_birth: Joi.date()
    .optional()
    .allow(null, ''),

  address: Joi.string()
    .max(500)
    .optional()
    .allow(''),

  country: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  state: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  city: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  district: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  village: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  position: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  experienced: Joi.boolean()
    .optional(),

  fresher: Joi.boolean()
    .optional(),

  expected_salary: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  expected_salary_min: Joi.number()
    .optional()
    .allow(null),

  expected_salary_max: Joi.number()
    .optional()
    .allow(null),

  total_experience_years: Joi.number()
    .optional()
    .allow(null),

  job_category: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  current_location: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  interview_availability: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  availability_start: Joi.date()
    .optional()
    .allow(null, ''),

  availability_end: Joi.date()
    .optional()
    .allow(null, ''),

  preferred_shift: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  // Work experience array
  work_experience: Joi.array()
    .items(
      Joi.object({
        position: Joi.string().required(),
        company: Joi.string().required(),
        start_date: Joi.date().optional().allow(null, ''),
        end_date: Joi.date().optional().allow(null, ''),
        salary_period: Joi.string().optional().allow(''),
        current_wages: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow(null, ''),
        current_city: Joi.string().optional().allow(''),
        current_village: Joi.string().optional().allow(''),
        is_current: Joi.boolean().optional(),
      })
    )
    .optional(),

  // Skills array
  skills: Joi.array()
    .items(
      Joi.object({
        skill_name: Joi.string().required(),
        years_of_experience: Joi.string().optional().allow(''),
      })
    )
    .optional(),
});

export const updateCandidateProfileSchema = Joi.object({
  full_name: Joi.string()
    .min(2)
    .max(255)
    .optional(),

  surname: Joi.string()
    .max(255)
    .allow('')
    .optional(),

  email: Joi.string()
    .email()
    .optional(),

  mobile_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .optional(),

  marital_status: Joi.string()
    .max(50)
    .optional()
    .allow(''),

  alternate_mobile_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(''),

  date_of_birth: Joi.date()
    .optional()
    .allow(null, ''),

  address: Joi.string()
    .max(500)
    .optional()
    .allow(''),

  country: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  state: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  city: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  district: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  village: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  position: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  experienced: Joi.boolean()
    .optional(),

  fresher: Joi.boolean()
    .optional(),

  expected_salary: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  expected_salary_min: Joi.number()
    .optional()
    .allow(null),

  expected_salary_max: Joi.number()
    .optional()
    .allow(null),

  total_experience_years: Joi.number()
    .optional()
    .allow(null),

  job_category: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  current_location: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  interview_availability: Joi.string()
    .max(255)
    .optional()
    .allow(''),

  availability_start: Joi.date()
    .optional()
    .allow(null, ''),

  availability_end: Joi.date()
    .optional()
    .allow(null, ''),

  preferred_shift: Joi.string()
    .max(100)
    .optional()
    .allow(''),

  status: Joi.string()
    .valid('Active', 'Inactive')
    .optional(),
});
