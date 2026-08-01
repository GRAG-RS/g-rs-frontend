export interface EnvironmentConfig {
  apiBaseUrl: string;
  env: 'development' | 'staging' | 'production' | 'test';
  appName: string;
  appVersion: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export const environment: EnvironmentConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.company.com',
  env: (import.meta.env.VITE_ENV as EnvironmentConfig['env']) || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'CorpDash',
  appVersion: import.meta.env.VITE_APP_VERSION || '2.0.0',
  isDevelopment: (import.meta.env.VITE_ENV || 'development') === 'development',
  isProduction: import.meta.env.VITE_ENV === 'production',
};
