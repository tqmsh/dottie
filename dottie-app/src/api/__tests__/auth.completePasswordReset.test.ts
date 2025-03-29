import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi, PasswordResetCompletionSchema } from "../auth";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth API: Complete Password Reset", () => {
  const resetCompletionData = {
    token: "valid-reset-token",
    newPassword: "newPassword123",
    confirmNewPassword: "newPassword123",
  };

  const successResponse = {
    data: {
      message: "Password has been reset successfully",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete password reset successfully", async () => {
    // Setup
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockResolvedValueOnce(successResponse),
    } as any);

    // Execute 
    const result = await authApi.completePasswordReset(resetCompletionData);

    // Verify
    expect(result).toEqual(successResponse.data);
    expect(mockedAxios.create).toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    // Setup
    const errorMessage = "Invalid or expired token";
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            error: errorMessage,
          },
        },
      }),
    } as any);

    // Execute & Verify
    await expect(authApi.completePasswordReset(resetCompletionData)).rejects.toThrow(
      errorMessage
    );
  });

  it("should handle generic errors", async () => {
    // Setup
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockRejectedValueOnce(new Error("Network error")),
    } as any);

    // Execute & Verify
    await expect(authApi.completePasswordReset(resetCompletionData)).rejects.toThrow(
      "Network error"
    );
  });
}); 