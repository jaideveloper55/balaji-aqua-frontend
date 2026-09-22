import authAxios from "../../../lib/axios";
import type {
  CreateUserPayload,
  UamUser,
  UserRole,
  MenuPermission,
} from "../types/Uam";

export const getUsersApi = () =>
  authAxios.get<any[]>("/users").then((res) => ({
    ...res,
    data: res.data.map(
      (u): UamUser => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        companies: (u.userCompanies ?? []).map((uc: any) => uc.company),
      })
    ),
  }));

export const createUserApi = (data: CreateUserPayload) =>
  authAxios.post("/users", data);

export const updateUserRoleApi = (
  id: string,
  role: Exclude<UserRole, "SUPER_ADMIN">
) => authAxios.patch(`/users/${id}`, { role });

export const updateUserStatusApi = (id: string, isActive: boolean) =>
  authAxios.patch(`/users/${id}`, { isActive });

// ── Companies (Add User dropdown) — real /companies endpoint ──
export const getCompaniesApi = () => authAxios.get("/companies");

// ── Role → Menu permissions — the one part of UAM that's genuinely new ──
export const getRolePermissionsApi = (role: UserRole) =>
  authAxios.get(`/uam/role-permissions/${role}`);

export const updateRolePermissionsApi = (
  role: UserRole,
  items: MenuPermission[]
) => authAxios.patch(`/uam/role-permissions/${role}`, { items });

export const deleteUserPermanentlyApi = (id: string) =>
  authAxios.delete(`/users/${id}/permanent`);
