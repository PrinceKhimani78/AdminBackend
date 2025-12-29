import { Request, Response, NextFunction } from 'express';
import { body, param, ValidationChain, validationResult } from 'express-validator';

// SQL injection prevention - sanitize all inputs
export const sanitizeInput = (value: any): any => {
  if (typeof value === 'string') {
    // Remove dangerous SQL patterns
    return value
      .replace(/['";\\]/g, '') // Remove quotes and backslashes
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove multi-line comment start
      .replace(/\*\//g, '') // Remove multi-line comment end
      .trim();
  }
  return value;
};

// Validate candidate profile input
export const validateCandidateProfile = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('mobile_number').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('full_name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('position').optional().trim().isLength({ max: 255 }),
  body('expected_salary').optional().trim().isLength({ max: 50 }),
  body('job_category').optional().trim().isLength({ max: 255 }),
];

// Validate UUID parameters
export const validateUUID = [
  param('id').isUUID(4).withMessage('Invalid ID format')
];

// Check validation results
export const checkValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  
  // Sanitize all string inputs to prevent SQL injection
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }
  
  next();
};
