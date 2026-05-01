export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
