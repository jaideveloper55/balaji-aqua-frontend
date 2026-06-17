import authAxios from "../../../lib/axios";
import type { LoginRequest } from "../types/Auth";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company: {
    name: string;
    type: "WATER_PLANT" | "BEVERAGE";
  };
}

// POST /auth/login
export const loginApi = (data: LoginRequest) => {
  return authAxios.post("/auth/login", data);
};

// POST /auth/register
export const registerApi = (data: RegisterRequest) => {
  return authAxios.post("/auth/register", data);
};

// POST /auth/logout
export const logoutApi = () => {
  return authAxios.post("/auth/logout");
};

// GET /auth/me
export const getMeApi = () => {
  return authAxios.get("/auth/me");
};
