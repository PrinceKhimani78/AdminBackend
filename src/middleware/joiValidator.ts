import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validateWithJoi = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true, // Allow fields not defined in schema (for now)
            stripUnknown: false
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            console.log('Joi Validation failed:', errorMessage);
            return res.status(400).json({
                success: false,
                message: `Validation failed: ${error.details[0].message}`,
                errors: error.details
            });
        }

        next();
    };
};
