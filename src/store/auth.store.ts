import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Company,
  LoginResponse,
  TenantId,
  User,
} from "../modules/auth/types/Auth";
import { COMPANY_TYPE_TO_TENANT } from "../modules/auth/types/Auth";

interface AuthState {
  // ── Persisted state ──
  user: User | null;
  companies: Company[];
  activeCompanyId: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  // ── Actions ──
  setAuth: (data: LoginResponse) => void;
  setAccessToken: (token: string) => void;
  setActiveCompany: (companyId: string) => void;
  logout: () => void;

  // ── Derived helpers ──
  isAuthenticated: () => boolean;
  getActiveCompany: () => Company | null;
  getActiveTenant: () => TenantId;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      companies: [],
      activeCompanyId: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (data) =>
        set({
          user: data.user,
          companies: data.companies,
          activeCompanyId: data.activeCompanyId,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),

      setAccessToken: (token) => set({ accessToken: token }),

      setActiveCompany: (companyId) => {
        const { companies } = get();
        const exists = companies.some((c) => c.id === companyId);
        if (!exists) return; // Ignore invalid switches
        set({ activeCompanyId: companyId });
      },

      logout: () =>
        set({
          user: null,
          companies: [],
          activeCompanyId: null,
          accessToken: null,
          refreshToken: null,
        }),

      isAuthenticated: () => !!get().accessToken && !!get().user,

      getActiveCompany: () => {
        const { companies, activeCompanyId } = get();
        return companies.find((c) => c.id === activeCompanyId) ?? null;
      },

      getActiveTenant: () => {
        const company = get().getActiveCompany();
        if (!company) return "sri-balaji-aqua"; // default
        return COMPANY_TYPE_TO_TENANT[company.type];
      },
    }),
    {
      name: "balaji-aqua-auth", // localStorage key
    }
  )
);
