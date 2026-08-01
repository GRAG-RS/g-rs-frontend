import { environment } from '../config/environment';

class Logger {
  private isEnabled = environment.isDevelopment;

  log(...args: unknown[]): void {
    if (this.isEnabled) {
      console.log('[LOG]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.isEnabled) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.isEnabled) {
      console.error('[ERROR]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.isEnabled) {
      console.info('[INFO]', ...args);
    }
  }
}

export const logger = new Logger();
