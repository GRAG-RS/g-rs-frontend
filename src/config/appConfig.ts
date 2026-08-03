import { environment } from './environment';

export const appConfig = {
  name: environment.appName,
  version: environment.appVersion,
  apiTimeoutMs: 15000,
  retryAttempts: 2,
  tokenHeaderKey: 'Authorization',
  tokenPrefix: 'Bearer ',
  defaultPageSize: 10,
  enableMockFallback: true,
};
