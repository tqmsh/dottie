import { apiClient } from "../core/apiClient";
import getCurrentUser from "./getCurrentUser";
import getUserById from "./getById";
import putUpdate from "./putUpdate";
import deleteUser from "./delete";
import postPasswordUpdate from "./postPasswordUpdate";
import { requestPasswordReset, completePasswordReset } from "./passwordReset";

// Export types
export * from "./types";

// Export individual endpoints
export {
  getCurrentUser,
  getUserById,
  putUpdate as updateUser,
  deleteUser,
  postPasswordUpdate as updatePassword,
  requestPasswordReset,
  completePasswordReset
};

// User API object for backward compatibility
export const userApi = {
  getProfile: getCurrentUser,
  getUserById,
  updateUser: putUpdate,
  deleteUser,
  resetPassword: requestPasswordReset,
  updatePassword: postPasswordUpdate
};

export default userApi; 