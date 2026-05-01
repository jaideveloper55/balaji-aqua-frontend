import api from '../lib/axios';
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
} from '../modules/auth/types/Auth';

export const authApi = {
  // POST /auth/login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // POST /auth/logout
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  // GET /auth/me
  me: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
  },
};