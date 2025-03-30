import { z } from "zod";
import { 
  LoginSchema, 
  SignupSchema, 
  UserSchema, 
  AuthResponseSchema,
  PasswordUpdateSchema,
  PasswordResetRequestSchema,
  PasswordResetCompletionSchema
} from "./schemas";

// Export type definitions
export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type PasswordUpdateInput = z.infer<typeof PasswordUpdateSchema>;
export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetCompletionInput = z.infer<typeof PasswordResetCompletionSchema>; 