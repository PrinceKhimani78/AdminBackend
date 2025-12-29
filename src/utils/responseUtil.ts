import { Response } from 'express';

interface SuccessResponse {
  success: true;
  message?: string;
  data?: any;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export const sendSuccess = (
  res: Response,
  data?: any,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: SuccessResponse = {
    success: true,
    message,
    ...(data && { data }),
  };

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'Error occurred',
  statusCode: number = 500,
  errors?: any
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  return res.status(statusCode).json(response);
};

export const sendCreated = (res: Response, data?: any, message: string = 'Created successfully'): Response => {
  return sendSuccess(res, data, message, 201);
};

export const sendNotFound = (res: Response, message: string = 'Resource not found'): Response => {
  return sendError(res, message, 404);
};

export const sendBadRequest = (res: Response, message: string = 'Bad request', errors?: any): Response => {
  return sendError(res, message, 400, errors);
};

export const sendUnauthorized = (res: Response, message: string = 'Unauthorized'): Response => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message: string = 'Forbidden'): Response => {
  return sendError(res, message, 403);
};
