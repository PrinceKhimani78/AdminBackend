export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  isValid: boolean;
  errors: ValidationError[];

  constructor() {
    this.isValid = true;
    this.errors = [];
  }

  addError(field: string, message: string): void {
    this.isValid = false;
    this.errors.push({ field, message });
  }

  hasErrors(): boolean {
    return !this.isValid;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

// String length validation
export const isMinLength = (value: string, min: number): boolean => {
  return !!(value && value.length >= min);
};

export const isMaxLength = (value: string, max: number): boolean => {
  return !!(value && value.length <= max);
};

// Number validation
export const isNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isPositiveNumber = (value: number): boolean => {
  return isNumber(value) && value > 0;
};

// Generic validator function
export const validate = (data: any, rules: ValidationRules): ValidationResult => {
  const result = new ValidationResult();

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    // Required validation
    if (fieldRules.required && !isRequired(value)) {
      result.addError(field, fieldRules.requiredMessage || `${field} is required`);
      continue;
    }

    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) continue;

    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      result.addError(field, fieldRules.emailMessage || `${field} must be a valid email`);
    }

    // Min length validation
    if (fieldRules.minLength && !isMinLength(value, fieldRules.minLength)) {
      result.addError(
        field,
        fieldRules.minLengthMessage || `${field} must be at least ${fieldRules.minLength} characters`
      );
    }

    // Max length validation
    if (fieldRules.maxLength && !isMaxLength(value, fieldRules.maxLength)) {
      result.addError(
        field,
        fieldRules.maxLengthMessage || `${field} must not exceed ${fieldRules.maxLength} characters`
      );
    }

    // Custom validation
    if (fieldRules.custom) {
      const customResult = fieldRules.custom(value, data);
      if (customResult !== true) {
        result.addError(field, typeof customResult === 'string' ? customResult : `${field} is invalid`);
      }
    }
  }

  return result;
};

// Validation rules interface
export interface ValidationRules {
  [field: string]: {
    required?: boolean;
    requiredMessage?: string;
    email?: boolean;
    emailMessage?: string;
    minLength?: number;
    minLengthMessage?: string;
    maxLength?: number;
    maxLengthMessage?: string;
    custom?: (value: any, allData: any) => boolean | string;
  };
}
