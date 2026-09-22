export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY";
export type CompanyType = "WATER_PLANT" | "BEVERAGE";

export interface UamCompany {
  id: string;
  name: string;
  type: CompanyType;
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
  companies: UamCompany[]; // flattened from UsersService's userCompanies shape
}

// Matches CreateUserDto on UsersService exactly — companyIds is a real
// array server-side (the backend genuinely supports one user working
// across several companies). Our Add User modal only lets you pick one
// today, so it wraps that single pick into a 1-item array on submit.
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: Exclude<UserRole, "SUPER_ADMIN">;
  companyIds: string[];
}

// No page/limit — GET /users has no server-side pagination.
// UamPage filters and paginates this list client-side instead.
export interface UamUserFilters {
  search?: string;
  role?: UserRole | "ALL";
}

export type MenuKey =
  | "DASHBOARD"
  | "CUSTOMER_MANAGEMENT"
  | "PRODUCT_MANAGEMENT"
  | "BILLING_POS"
  | "EVENT_ORDERS"
  | "INVENTORY"
  | "EXPENSES";

export interface MenuPermission {
  menuKey: MenuKey;
  isEnabled: boolean;
}
