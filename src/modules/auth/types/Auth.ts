export type TenantId = "sri-balaji-aqua" | "royal-beverage";

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY";

export type CompanyType = "WATER_PLANT" | "BEVERAGE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  companies: Company[];
  activeCompanyId: string;
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  companies: Company[];
}

export const COMPANY_TYPE_TO_TENANT: Record<CompanyType, TenantId> = {
  WATER_PLANT: "sri-balaji-aqua",
  BEVERAGE: "royal-beverage",
};

export const TENANT_TO_COMPANY_TYPE: Record<TenantId, CompanyType> = {
  "sri-balaji-aqua": "WATER_PLANT",
  "royal-beverage": "BEVERAGE",
};
