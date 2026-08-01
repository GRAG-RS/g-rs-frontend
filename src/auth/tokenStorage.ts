import { STORAGE_KEYS } from '../constants/storage';
import { storage } from '../utils/storage';
import type { User } from '../types/User';

export const tokenStorage = {
  getToken(): string | null {
    return storage.get<string>(STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    storage.set(STORAGE_KEYS.TOKEN, token);
  },

  getUser(): User | null {
    return storage.get<User>(STORAGE_KEYS.USER);
  },

  setUser(user: User): void {
    storage.set(STORAGE_KEYS.USER, user);
  },

  clearSession(): void {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },
};
