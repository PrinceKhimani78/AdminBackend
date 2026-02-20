import { body, query, param } from 'express-validator';

// Generic query validation for list endpoints (limit, offset, search)
export const validateLookupQuery = [
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
    query('search').optional().trim().isLength({ min: 1 }).withMessage('Search query cannot be empty if provided'),
];

export const validateIndustryQuery = [
    ...validateLookupQuery
];

export const validateCategoryQuery = [
    ...validateLookupQuery,
    query('industry_id').optional().isInt({ min: 1 }).withMessage('industry_id must be a positive integer'),
];

export const validateJobRoleQuery = [
    ...validateLookupQuery,
    query('category_id').optional().isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
];

// Path Parameter Validation for single fetch and update actions
// We are expecting numeric IDs for our lookup tables (industries, categories, job_roles)
export const validateIdParam = [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

// --- CREATE Validations ---

export const validateCreateIndustry = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),
    body('slug').trim().notEmpty().withMessage('Slug is required').isLength({ max: 255 }).withMessage('Slug must not exceed 255 characters'),
];

export const validateCreateCategory = [
    body('industry_id').notEmpty().withMessage('industry_id is required').isInt({ min: 1 }).withMessage('industry_id must be a positive integer'),
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),
];

export const validateCreateJobRole = [
    body('category_id').notEmpty().withMessage('category_id is required').isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),
];

// --- UPDATE Validations (Supports Single Object or Array) ---

// Helper to support body validation for both a single object or an array of objects
const validateBulkOrSingle = (validations: any[]) => {
    return [
        body().custom((value) => {
            if (!Array.isArray(value) && typeof value !== 'object') {
                throw new Error('Body must be an object or an array of objects');
            }
            return true;
        }),
        ...validations.map(validation => {
            // If the body is an array, we apply the validation to `*.<field>`
            // If it's a single object, we want to apply it directly.
            // Therefore, express-validator wildcards '.*' handle arrays, or just the field itself
            return (req: any, res: any, next: any) => {
                const isArray = Array.isArray(req.body);
                const prefix = isArray ? '*.' : '';
                // Hacky trick: We're simply defining the chains for both single and array formats
                // We do this by applying the specific rule separately depending on if the body is an array inside the middleware stack.
                return next();
            };
        })
    ]
};

// Instead of complex custom middleware, we use express-validator wildcard structure correctly
// express-validator supports validating properties of array objects natively.

export const validateUpdateIndustries = [
    body().custom(value => Array.isArray(value) || (typeof value === 'object' && value !== null)),
    body('*.id').if(body().isArray()).isInt({ min: 1 }).withMessage('ID must be a positive integer in all objects'),
    body('*.name').if(body().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
    body('*.slug').if(body().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Slug must be between 1 and 255 characters'),

    // Single object validation path
    body('id').if(body().not().isArray()).isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('name').if(body().not().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
    body('slug').if(body().not().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Slug must be between 1 and 255 characters'),
];

export const validateUpdateCategories = [
    body().custom(value => Array.isArray(value) || (typeof value === 'object' && value !== null)),
    body('*.id').if(body().isArray()).isInt({ min: 1 }).withMessage('ID must be a positive integer in all objects'),
    body('*.industry_id').if(body().isArray()).optional().isInt({ min: 1 }).withMessage('industry_id must be a positive integer'),
    body('*.name').if(body().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),

    // Single object validation path
    body('id').if(body().not().isArray()).isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('industry_id').if(body().not().isArray()).optional().isInt({ min: 1 }).withMessage('industry_id must be a positive integer'),
    body('name').if(body().not().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
];

export const validateUpdateJobRoles = [
    body().custom(value => Array.isArray(value) || (typeof value === 'object' && value !== null)),
    body('*.id').if(body().isArray()).isInt({ min: 1 }).withMessage('ID must be a positive integer in all objects'),
    body('*.category_id').if(body().isArray()).optional().isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
    body('*.name').if(body().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),

    // Single object validation path
    body('id').if(body().not().isArray()).isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('category_id').if(body().not().isArray()).optional().isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
    body('name').if(body().not().isArray()).optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
];
