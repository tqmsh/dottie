import { z } from "zod";
import { UserSchema } from "./schemas";

// Re-export User from auth
export { User } from "../../auth/utils/types";

// User Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetCompletion {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export type User = z.infer<typeof UserSchema>; 