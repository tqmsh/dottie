import axios from "axios";
import { z } from "zod";

// Zod schemas for validation
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  age: z.nullable(z.number()),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

// Password update schema
export const PasswordUpdateSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmNewPassword"],
      });
    }
  });

// Types
export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type PasswordUpdateInput = z.infer<typeof PasswordUpdateSchema>;

// Create axios instance with default config
export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API functions
export const authApi = {
  // Login
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/auth/login",
        credentials
      );
      const validatedData = AuthResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error || "Login failed, please try again later");
      }
      throw error;
    }
  },

  // Signup
  signup: async (userData: SignupInput): Promise<User> => {
    try {
      const response = await axios.post<User>(
        "/api/auth/signup",
        userData
      );
      const validatedData = UserSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error || "Signup failed, please try again later");
      }
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Logout failed");
      }
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (!user?.id) {
        throw new Error('No user ID found');
      }

      const response = await api.get<User>(`/api/auth/users/${user.id}`);
      const validatedData = UserSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to get user data"
        );
      }
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await api.post<{ token: string }>("/auth/refresh");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Token refresh failed"
        );
      }
      throw error;
    }
  },

  // Update password
  updatePassword: async (userId: string, passwordData: PasswordUpdateInput): Promise<{ message: string }> => {
    try {
      const { currentPassword, newPassword } = passwordData;
      const response = await api.post<{ message: string }>(
        `/api/user/pw/update/${userId}`,
        { currentPassword, newPassword }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Password update failed, please try again later"
        );
      }
      throw error;
    }
  },
};
