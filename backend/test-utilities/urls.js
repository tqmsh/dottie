// API URLs for different test environments
export const URLS = {
  DEV: 'http://localhost:5000',
  PROD: 'https://dottie-api-zeta.vercel.app'
};

// Get current environment (defaults to DEV)
export const getEnvironment = () => {
  return process.env.TEST_ENV?.toUpperCase() === 'PROD' ? 'PROD' : 'DEV';
};

// Get API URL for the current or specified environment
export const getApiUrl = (env = getEnvironment()) => {
  return URLS[env];
}; 