import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export type UserRole = 'owner' | 'admin' | 'supervisor' | 'technician';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  logo?: string;
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
  };
}

export interface Session {
  user: User;
  organization: Organization;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  // State
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSession: (session: Session) => void;
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
  
  // Computed
  getFullName: () => string;
  getInitials: () => string;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      setSession: (session) =>
        set({
          user: session.user,
          organization: session.organization,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),
      
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      
      setOrganization: (org) =>
        set({ organization: org }),
      
      setLoading: (isLoading) =>
        set({ isLoading }),
      
      setError: (error) =>
        set({ error, isLoading: false }),
      
      clearSession: () =>
        set({
          user: null,
          organization: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),
      
      // Computed
      getFullName: () => {
        const { user } = get();
        return user ? `${user.firstName} ${user.lastName}` : '';
      },
      
      getInitials: () => {
        const { user } = get();
        if (!user) return '';
        return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
      },
      
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
      },
    }),
    {
      name: 'fieldcore-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for common patterns
export const selectUser = (state: AuthState) => state.user;
export const selectOrganization = (state: AuthState) => state.organization;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUserRole = (state: AuthState) => state.user?.role;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
