'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { tokenService } from '@/lib/api-client';
import { authService } from '../services/auth.service';
import type { UserRole } from '@/store/auth.store';

interface UseAuthOptions {
  requiredRoles?: UserRole | UserRole[];
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requiredRoles, redirectTo = '/auth/login' } = options;
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  const { user, organization, isAuthenticated, isLoading, hasRole, getFullName, getInitials } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!tokenService.isAuthenticated()) {
        router.push(redirectTo);
        setIsChecking(false);
        return;
      }
      try {
        await authService.refreshToken();
        await authService.getCurrentUser();
      } catch {
        router.push(redirectTo);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [redirectTo, router]);

  const isAuthorized = useCallback(() => {
    if (!requiredRoles) return true;
    return hasRole(requiredRoles);
  }, [requiredRoles, hasRole]);

  return {
    user, organization, isAuthenticated,
    isLoading: isLoading || isChecking,
    isAuthorized: isAuthorized(),
    hasRole, getFullName, getInitials,
  };
}
