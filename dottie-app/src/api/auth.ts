import axios from "axios";
import { z } from "zod";

// API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dottie-api-zeta.vercel.app";

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
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

// Types
export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
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
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  // Signup
  signup: async (userData: SignupInput): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/signup",
        userData
      );
      const validatedData = AuthResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Signup failed");
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
        throw new Error(error.response?.data?.message || "Logout failed");
      }
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>("/auth/me");
      const validatedData = UserSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to get user data"
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
          error.response?.data?.message || "Token refresh failed"
        );
      }
      throw error;
    }
  },
};
