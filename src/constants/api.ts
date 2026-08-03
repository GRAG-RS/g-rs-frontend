export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    LOGOUT: '/api/users/logout',
    REFRESH: '/api/users/refresh',
    ME: '/api/users/me',
  },
  EMPLOYEES: {
    BASE: '/api/v1/employees',
    BY_ID: (id: string) => `/api/v1/employees/${id}`,
  },
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  DASHBOARD: {
    SUMMARY: '/api/dashboard/summary',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
