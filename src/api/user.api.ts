import api from "../lib/axios";
import type { MeResponse } from "../modules/auth/types/Auth";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../modules/profile/types/Profile";

export const usersApi = {
  // PATCH /users/me — update own profile
  updateMe: async (data: UpdateProfileRequest): Promise<MeResponse> => {
    const response = await api.patch<MeResponse>("/users/me", data);
    return response.data;
  },

  // POST /users/me/change-password — change own password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/users/me/change-password",
      data
    );
    return response.data;
  },
};
