import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "../../../store/auth.store";
import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import type { UpdateProfileRequest } from "../types/Profile";
import { usersApi } from "../../../api/user.api";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { companies, activeCompanyId, accessToken, refreshToken } =
    useAuthStore.getState();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersApi.updateMe(data),

    onSuccess: (updatedUser) => {
      // Sync the updated user back into Zustand
      setAuth({
        message: "Profile updated",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
        },
        companies,
        activeCompanyId: activeCompanyId ?? "",
        accessToken: accessToken ?? "",
        refreshToken: refreshToken ?? "",
      });

      // Invalidate /me query so any consumer refreshes
      queryClient.invalidateQueries({ queryKey: ["me"] });

      successNotification(
        "Profile updated",
        "Your changes have been saved successfully"
      );
    },

    onError: (error: any) => {
      errorNotification(
        "Update failed",
        error?.response?.data?.message ||
          "Could not update your profile. Please try again."
      );
    },
  });
};
