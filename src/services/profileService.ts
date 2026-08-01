import type { User } from '../types';
import { authService } from './authService';

export class ProfileService {
  async getProfile(): Promise<User> {
    return authService.getCurrentUser();
  }
}

export const profileService = new ProfileService();
