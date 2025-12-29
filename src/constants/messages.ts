// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_RETRIEVED: 'User retrieved successfully',
  USERS_RETRIEVED: 'Users retrieved successfully',
  CANDIDATE_CREATED: 'Candidate created successfully',
  CANDIDATE_UPDATED: 'Candidate updated successfully',
  CANDIDATE_DELETED: 'Candidate deleted successfully',
  CANDIDATE_RETRIEVED: 'Candidate retrieved successfully',
  CANDIDATES_RETRIEVED: 'Candidates retrieved successfully',
  FILES_UPLOADED: 'Files uploaded successfully',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_ID: 'Invalid user ID',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  BAD_REQUEST: 'Bad request',
  DB_ERROR: 'Database operation failed',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters long',
  NAME_MAX_LENGTH: 'Name cannot exceed 255 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  EMAIL_EXISTS: 'Email already exists',
} as const;

// Database Messages
export const DB_MESSAGES = {
  CONNECTION_SUCCESS: 'Database connected successfully',
  CONNECTION_FAILED: 'Database connection failed',
  MIGRATION_SUCCESS: 'Migration completed successfully',
  MIGRATION_FAILED: 'Migration failed',
  SEED_SUCCESS: 'Database seeded successfully',
  SEED_FAILED: 'Seed failed',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
