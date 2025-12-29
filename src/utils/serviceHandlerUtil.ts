import { ERROR_MESSAGES } from '../constants';

/**
 * Custom error class for handling application errors
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wraps async service functions with error handling
 */
export const handleServiceCall = async <T>(
  serviceFunction: () => Promise<T>
): Promise<T> => {
  try {
    return await serviceFunction();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
};

/**
 * Handles not found scenarios
 */
export const handleNotFound = (message: string = ERROR_MESSAGES.USER_NOT_FOUND): never => {
  throw new AppError(message, 404);
};

/**
 * Handles duplicate entry scenarios
 */
export const handleDuplicate = (message: string = ERROR_MESSAGES.USER_ALREADY_EXISTS): never => {
  throw new AppError(message, 409);
};

/**
 * Handles database errors
 */
export const handleDBError = (error: any, customMessage?: string): never => {
  // Handle MySQL duplicate entry error
  if (error.code === 'ER_DUP_ENTRY') {
    throw new AppError(customMessage || ERROR_MESSAGES.USER_ALREADY_EXISTS, 409);
  }

  // Handle MySQL foreign key constraint error
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    throw new AppError('Referenced record does not exist', 400);
  }

  throw new AppError(customMessage || ERROR_MESSAGES.DB_ERROR, 500);
};

/**
 * Validates that a resource exists, throws error if not
 */
export const ensureExists = <T>(
  resource: T | null | undefined,
  message: string = ERROR_MESSAGES.USER_NOT_FOUND
): T => {
  if (!resource) {
    throw new AppError(message, 404);
  }
  return resource;
};

/**
 * Validates that a resource does not already exist
 */
export const ensureNotExists = <T>(
  resource: T | null | undefined,
  message: string = ERROR_MESSAGES.USER_ALREADY_EXISTS
): void => {
  if (resource) {
    throw new AppError(message, 409);
  }
};
