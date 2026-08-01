import { logger } from './logger';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      logger.error(`Error reading key "${key}" from localStorage`, err);
      return null;
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      logger.error(`Error writing key "${key}" to localStorage`, err);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      logger.error(`Error removing key "${key}" from localStorage`, err);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (err) {
      logger.error('Error clearing localStorage', err);
    }
  },
};
