import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { STORAGE_KEYS } from '../constants/storage';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';

let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (cb: () => void) => {
  onUnauthorizedCallback = cb;
};

export const setupInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storage.get<string>(STORAGE_KEYS.TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      logger.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 401 || status === 403) {
          logger.warn(`Received ${status} response, initiating session cleanup.`);
          storage.remove(STORAGE_KEYS.TOKEN);
          storage.remove(STORAGE_KEYS.USER);
          if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
          }
        }
      } else if (error.request) {
        logger.error('Network Error - ALB target unavailable:', error.request);
      }
      return Promise.reject(error);
    }
  );
};
