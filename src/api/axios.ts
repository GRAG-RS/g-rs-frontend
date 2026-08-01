import axios from 'axios';
import { environment } from '../config/environment';
import { appConfig } from '../config/appConfig';

export const apiClient = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: appConfig.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;
