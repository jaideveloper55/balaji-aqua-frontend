import { useMutation } from "@tanstack/react-query";

import {
  successNotification,
  errorNotification,
} from "../../../components/common/Notification";
import type { ChangePasswordRequest } from "../types/Profile";
import { usersApi } from "../../../api/user.api";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => usersApi.changePassword(data),

    onSuccess: () => {
      successNotification(
        "Password changed",
        "Your password has been updated successfully"
      );
    },

    onError: (error: any) => {
      errorNotification(
        "Could not change password",
        error?.response?.data?.message ||
          "Please verify your current password and try again."
      );
    },
  });
};
