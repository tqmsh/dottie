import { describe, it, expect } from "vitest";
import { PasswordUpdateSchema } from "../../../api/auth";

describe("Password Update Schema", () => {
  it("validates password update input correctly", () => {
    // Valid input
    const validInput = {
      currentPassword: "Password123!",
      newPassword: "NewPassword456!",
      confirmNewPassword: "NewPassword456!",
    };
    
    const validationResult = PasswordUpdateSchema.safeParse(validInput);
    expect(validationResult.success).toBe(true);
    
    // Invalid input - passwords don't match
    const invalidInput = {
      currentPassword: "Password123!",
      newPassword: "NewPassword456!",
      confirmNewPassword: "DifferentPassword!",
    };
    
    const invalidValidationResult = PasswordUpdateSchema.safeParse(invalidInput);
    expect(invalidValidationResult.success).toBe(false);
    
    // Invalid input - password too short
    const shortPasswordInput = {
      currentPassword: "123!",
      newPassword: "NewPassword456!",
      confirmNewPassword: "NewPassword456!",
    };
    
    const shortPasswordResult = PasswordUpdateSchema.safeParse(shortPasswordInput);
    expect(shortPasswordResult.success).toBe(false);
  });
}); 