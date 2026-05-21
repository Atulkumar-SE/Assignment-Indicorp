import { getMechanics } from './localStorageHelpers';

/**
 * Validates the mechanic registration inputs.
 * Returns an object with errors (if any) and a boolean indicating validity.
 */
export const validateRegistration = (data) => {
  const errors = {};
  const mechanics = getMechanics();

  // Full Name validation
  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Full Name is required.';
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'Full Name must be at least 3 characters long.';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please provide a valid email address.';
  } else {
    // Check email uniqueness
    const emailExists = mechanics.some(m => m.email.toLowerCase() === data.email.toLowerCase());
    // Admin email is also unique and reserved
    if (emailExists || data.email.toLowerCase() === 'admin@gmail.com') {
      errors.email = 'This email address is already registered.';
    }
  }

  // Mobile number validation
  const mobileRegex = /^[0-9]{10}$/;
  if (!data.mobile) {
    errors.mobile = 'Mobile number is required.';
  } else if (!mobileRegex.test(data.mobile)) {
    errors.mobile = 'Mobile number must be exactly 10 digits.';
  } else {
    // Check mobile uniqueness
    const mobileExists = mechanics.some(m => m.mobile === data.mobile);
    if (mobileExists) {
      errors.mobile = 'This mobile number is already registered.';
    }
  }

  // Level of Mechanic validation
  const validLevels = ['Expert', 'Medium', 'New Recruit', 'Trainee'];
  if (!data.level || !validLevels.includes(data.level)) {
    errors.level = 'Please select a valid mechanic level.';
  }

  // Password validation
  // Rule: letters, numbers, special characters, min 8 chars
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (!passwordRegex.test(data.password)) {
    errors.password = 'Password must be at least 8 characters long and contain letters, numbers, and at least one special character (@$!%*#?&).';
  }

  // Confirm Password validation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Filter character inputs to allow only digits, up to 10 numbers max.
 */
export const cleanMobileInput = (val) => {
  return val.replace(/\D/g, '').slice(0, 10);
};
