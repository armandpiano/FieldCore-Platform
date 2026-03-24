'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { tokenService } from '@/lib/api-client';
import { authService } from '@/modules/auth/services/auth.service';

interface AuthProviderProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isRefreshing = useRef(false);
  
  const { 
    isAuthenticated, 
    isLoading, 
    setLoading,
    clearSession,
    setError,
  } = useAuthStore();

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname?.startsWith('/auth/reset') || pathname?.startsWith('/auth/verify')
  );

  // Initialize auth state
  const initAuth = useCallback(async () => {
    if (isPublicPath) return;

    // Check if we have a token
    if (!tokenService.isAuthenticated()) {
      if (!isPublicPath) {
        router.push('/auth/login');
      }
      return;
    }

    setLoading(true);

    try {
      // Try to refresh token and get current user
      const refreshed = await authService.refreshToken();
      
      if (refreshed) {
        await authService.getCurrentUser();
      } else {
        // Token is invalid or refresh failed
        clearSession();
        if (!isPublicPath) {
          router.push('/auth/login');
        }
      }
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      clearSession();
      if (!isPublicPath) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  }, [isPublicPath, router, clearSession, setLoading]);

  // Handle token refresh on 401 errors globally
  const handleUnauthorized = useCallback(async () => {
    if (isRefreshing.current) return;
    
    isRefreshing.current = true;
    
    try {
      const refreshed = await authService.refreshToken();
      
      if (!refreshed) {
        clearSession();
        router.push('/auth/login');
      }
    } catch {
      clearSession();
      router.push('/auth/login');
    } finally {
      isRefreshing.current = false;
    }
  }, [clearSession, router]);

  // Initialize on mount and pathname change
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Redirect authenticated users from public paths
  useEffect(() => {
    if (isAuthenticated && isPublicPath && pathname !== '/') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isPublicPath, pathname, router]);

  // Show loading state while checking auth
  if (!isPublicPath && isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <div className='h-12 w-12 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary animate-spin' />
          <p className='text-slate-500'>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
