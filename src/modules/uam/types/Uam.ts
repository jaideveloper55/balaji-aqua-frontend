export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY";

export interface UamCompany {
  id: string;
  name: string;
  type: "WATER_PLANT" | "BEVERAGE";
}

export interface UamUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  userCompanies: { company: UamCompany }[];
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  companyId?: string;
}
