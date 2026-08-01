import apiClient from './axios';
import { setupInterceptors } from './interceptors';

setupInterceptors(apiClient);

export { apiClient };
export * from './endpoints';
export * from './interceptors';
