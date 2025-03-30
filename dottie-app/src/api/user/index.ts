import getById from "./requests/getById";
import getCurrentUser from "./requests/getCurrentUser";
import putUpdate from "./requests/putUpdate";
import deleteUser from "./requests/delete";
import postPasswordUpdate from "./requests/postPasswordUpdate";
import { requestPasswordReset, completePasswordReset } from "./requests/passwordReset";

// Export types
export * from "./utils/types";

// Export individual endpoints
export {
  getCurrentUser,
  getById as getUserById,
  putUpdate as updateUser,
  deleteUser,
  postPasswordUpdate as updatePassword,
  requestPasswordReset,
  completePasswordReset
};

// User API object for backward compatibility
export const userApi = {
  current: getCurrentUser,
  getById,
  update: putUpdate,
  delete: deleteUser,
  updatePassword: postPasswordUpdate,
  passwordReset: {
    request: requestPasswordReset,
    complete: completePasswordReset
  }
};

export default userApi; 