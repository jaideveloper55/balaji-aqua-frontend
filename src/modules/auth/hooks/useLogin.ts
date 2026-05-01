import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import type { LoginRequest } from "../types/Auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),

    onSuccess: (data) => {
      setAuth(data);
      successNotification(
        "Welcome back!",
        `Logged in as ${data.user.firstName} ${data.user.lastName}`
      );
      navigate("/admin/dashboard", { replace: true }); // ← /admin/dashboard
    },

    onError: (error: any) => {
      errorNotification(
        "Login failed",
        error?.response?.data?.message ||
          "Please check your credentials and try again"
      );
    },
  });
};
