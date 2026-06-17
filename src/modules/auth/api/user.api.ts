import authAxios from "../../../lib/axios";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../../profile/types/Profile";

// PATCH /users/me — update own profile
export const updateMeApi = (data: UpdateProfileRequest) => {
  return authAxios.patch("/users/me", data);
};

// POST /users/me/change-password — change own password
export const changePasswordApi = (data: ChangePasswordRequest) => {
  return authAxios.post("/users/me/change-password", data);
};
