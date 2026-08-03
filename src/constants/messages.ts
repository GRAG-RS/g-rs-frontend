export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Signed in successfully.',
    LOGIN_FAILED: 'Authentication failed. Please check your credentials.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    UNAUTHORIZED: 'You are not authorized to perform this operation.',
  },
  EMPLOYEES: {
    FETCH_ERROR: 'Failed to load employee records.',
    CREATE_SUCCESS: 'Employee record created successfully.',
    UPDATE_SUCCESS: 'Employee record updated successfully.',
    DELETE_SUCCESS: 'Employee record deleted successfully.',
    DELETE_CONFIRM: 'Are you sure you want to delete this employee?',
  },
  PRODUCTS: {
    FETCH_ERROR: 'Failed to load product records.',
    CREATE_SUCCESS: 'Product item created successfully.',
    UPDATE_SUCCESS: 'Product item updated successfully.',
    DELETE_SUCCESS: 'Product item deleted successfully.',
    DELETE_CONFIRM: 'Are you sure you want to delete this product?',
  },
  GENERIC: {
    NETWORK_ERROR: 'Unable to connect to microservices ALB endpoint.',
    SOMETHING_WENT_WRONG: 'An unexpected runtime error occurred.',
  },
} as const;
