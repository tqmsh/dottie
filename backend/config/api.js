/**
 * API Configuration
 * 
 * This file contains centralized API configuration values used across the application
 * and testing suite.
 */

// Production API URL
export const PROD_API_URL = 'https://dottie-api-zeta.vercel.app';

// Development/local API URL
export const DEV_API_URL = 'http://localhost:3000';

// Default API URL based on environment
export const DEFAULT_API_URL = process.env.NODE_ENV === 'production' 
  ? PROD_API_URL 
  : DEV_API_URL;

// Export configuration object
export default {
  PROD_API_URL,
  DEV_API_URL,
  DEFAULT_API_URL
}; 