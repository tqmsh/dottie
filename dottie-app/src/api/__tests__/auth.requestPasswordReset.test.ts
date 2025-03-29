import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi, PasswordResetRequestSchema } from "../auth";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth API: Request Password Reset", () => {
  const resetRequestData = {
    email: "test@example.com",
  };

  const successResponse = {
    data: {
      message: "Password reset email sent",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should request password reset successfully", async () => {
    // Setup
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockResolvedValueOnce(successResponse),
    } as any);

    // Execute 
    const result = await authApi.requestPasswordReset(resetRequestData);

    // Verify
    expect(result).toEqual(successResponse.data);
    expect(mockedAxios.create).toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    // Setup
    const errorMessage = "Email not found";
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
    await expect(authApi.requestPasswordReset(resetRequestData)).rejects.toThrow(
      errorMessage
    );
  });

  it("should handle generic errors", async () => {
    // Setup
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockRejectedValueOnce(new Error("Network error")),
    } as any);

    // Execute & Verify
    await expect(authApi.requestPasswordReset(resetRequestData)).rejects.toThrow(
      "Network error"
    );
  });
}); 