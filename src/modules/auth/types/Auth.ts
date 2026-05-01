// ─── TENANT (frontend-only — for branding/theming) ─────────────────────────
export type TenantId = "sri-balaji-aqua" | "royal-beverage";

// ─── BACKEND TYPES (match the API exactly) ─────────────────────────────────

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

// ─── COMPANY TYPE ↔ TENANT ID MAPPING ──────────────────────────────────────
// Backend uses CompanyType (WATER_PLANT/BEVERAGE) for theming context
// Frontend uses TenantId for branding lookup
export const COMPANY_TYPE_TO_TENANT: Record<CompanyType, TenantId> = {
  WATER_PLANT: "sri-balaji-aqua",
  BEVERAGE: "royal-beverage",
};

export const TENANT_TO_COMPANY_TYPE: Record<TenantId, CompanyType> = {
  "sri-balaji-aqua": "WATER_PLANT",
  "royal-beverage": "BEVERAGE",
};
