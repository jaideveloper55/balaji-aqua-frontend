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

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

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
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

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
        if (!exists) return;

        set({ activeCompanyId: companyId });

        window.location.href = "/admin/customers";
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
        if (!company) return "sri-balaji-aqua";
        return COMPANY_TYPE_TO_TENANT[company.type];
      },
    }),
    {
      name: "balaji-aqua-auth",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },

      partialize: (state) => ({
        user: state.user,
        companies: state.companies,
        activeCompanyId: state.activeCompanyId,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
