'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { tokenService } from '@/lib/api-client';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/demo'];

// Routes that require authentication
const PRIVATE_ROUTES = ['/dashboard'];

// Routes that require specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard/users': ['owner', 'admin'],
  '/dashboard/settings': ['owner', 'admin'],
};

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  const { user, isAuthenticated, setLoading, setUser, clearSession } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      // Check if path is public
      const isPublic = PUBLIC_ROUTES.some(
        route => pathname === route || pathname?.startsWith('/auth/reset') || pathname?.startsWith('/auth/verify')
      );
      
      if (isPublic) {
        // If authenticated and trying to access public route, redirect to dashboard
        if (tokenService.isAuthenticated()) {
          router.push('/dashboard');
          return;
        }
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      // Check authentication
      if (!tokenService.isAuthenticated()) {
        router.push('/auth/login');
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        // Verify token is still valid
        const refreshed = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${tokenService.getAccessToken()}`,
          },
        });

        if (!refreshed.ok) {
          throw new Error('Token expired');
        }

        const userData = await refreshed.json();
        setUser(userData);
        
        // Check role-based access
        const requiredRoles = ROLE_ROUTES[pathname || ''];
        if (requiredRoles && userData.role && !requiredRoles.includes(userData.role)) {
          router.push('/dashboard');
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        setIsAuthorized(true);
      } catch {
        clearSession();
        router.push('/auth/login');
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, setLoading, setUser, clearSession]);

  // Show loading state while checking auth
  if (isAuthorized === null) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary' />
          <p className='text-slate-500'>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// HOC for protecting components
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { requiredRoles?: string[] }
) {
  return function WithAuthComponent(props: P) {
    return (
      <AuthGuard>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };
}

// Hook for programmatic auth checks
export function useAuthGuard() {
  const { user, isAuthenticated, hasRole } = useAuthStore();
  
  const canAccess = (roles?: string[]) => {
    if (!isAuthenticated) return false;
    if (!roles) return true;
    return roles.some(role => hasRole(role as any));
  };

  return {
    user,
    isAuthenticated,
    canAccess,
    isOwner: hasRole('owner'),
    isAdmin: hasRole(['owner', 'admin']),
    isSupervisor: hasRole(['owner', 'admin', 'supervisor']),
    isTechnician: hasRole(['owner', 'admin', 'supervisor', 'technician']),
  };
}
