import axios from "axios";
import { apiClient } from "../core/apiClient";
import { SignupSchema } from "./schemas";
import { SignupInput, User } from "./types";
import { UserSchema } from "../user/schemas";

/**
 * Register a new user account
 * @endpoint /api/auth/signup (POST)
 */
export const postSignup = async (userData: SignupInput): Promise<User> => {
  try {
    const response = await apiClient.post<User>(
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
};

export default postSignup; 