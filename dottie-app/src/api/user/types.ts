import { z } from "zod";
import { UserSchema } from "./schemas";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export type User = z.infer<typeof UserSchema>; 