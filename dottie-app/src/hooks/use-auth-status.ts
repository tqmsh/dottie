"use client"

import { useAuth } from './use-auth';

/**
 * @deprecated Use useAuth hook instead
 * Backward compatibility hook for existing code that uses useAuthStatus
 */
export function useAuthStatus() {
  return useAuth();
} 