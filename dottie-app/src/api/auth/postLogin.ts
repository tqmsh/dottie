import axios from "axios";
import { apiClient } from "../core/apiClient";
import { LoginSchema, AuthResponseSchema } from "./schemas";
import { LoginInput, AuthResponse } from "./types";

/**
 * Login user with email and password
 * @endpoint /api/auth/login (POST)
 */
export const postLogin = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
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
};

export default postLogin; 