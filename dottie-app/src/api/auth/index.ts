import postLogin from "./requests/postLogin";
import postSignup from "./requests/postSignup";
import postLogout from "./requests/postLogout";
import postRefreshToken from "./requests/postRefreshToken";

// Export types
export * from "./utils/types";

// Export individual endpoints
export {
  postLogin as login,
  postSignup as signup,
  postLogout as logout,
  postRefreshToken as refreshToken
};

// Auth API object for backward compatibility
export const authApi = {
  login: postLogin,
  signup: postSignup,
  logout: postLogout,
  refreshToken: postRefreshToken
};

export default authApi; 