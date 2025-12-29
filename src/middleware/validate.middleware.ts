import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendBadRequest } from '../utils/responseUtil';
import { ERROR_MESSAGES } from '../constants';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      sendBadRequest(res, ERROR_MESSAGES.VALIDATION_FAILED, errors);
      return;
    }

    // Replace request body with validated value
    req.body = value;
    next();
  };
};
