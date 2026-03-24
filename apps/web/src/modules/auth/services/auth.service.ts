import apiClient, { tokenService } from '@/lib/api-client';
import { useAuthStore, type User, type Organization, type Session } from '@/store/auth.store';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  organization: Organization;
  expiresIn: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  companyName: string;
  companySize: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  organization: Organization;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth Service
export const authService = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<Session> {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', data);
    const { accessToken, refreshToken, user, organization, expiresIn } = response.data;
    
    // Store tokens
    tokenService.setTokens(accessToken, refreshToken, expiresIn);
    tokenService.setOrganizationId(organization.id);
    
    // Create session
    const session: Session = { user, organization, accessToken, refreshToken };
    
    // Update store
    useAuthStore.getState().setSession(session);
    
    return session;
  },

  /**
   * Register new user and organization
   */
  async register(data: RegisterRequest): Promise<Session> {
    const response = await apiClient.post<RegisterResponse>('/api/v1/auth/register', {
      ...data,
      companySize: data.companySize,
    });
    
    const { accessToken, refreshToken, user, organization } = response.data;
    
    // Store tokens
    tokenService.setTokens(accessToken, refreshToken);
    tokenService.setOrganizationId(organization.id);
    
    // Create session
    const session: Session = { user, organization, accessToken, refreshToken };
    
    // Update store
    useAuthStore.getState().setSession(session);
    
    return session;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (fire and forget)
      await apiClient.post('/api/v1/auth/logout').catch(() => {
        // Ignore errors - we want to clear local session anyway
      });
    } finally {
      // Always clear local session
      tokenService.clearAuthTokens();
      useAuthStore.getState().clearSession();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = tokenService.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/api/v1/auth/refresh',
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Update tokens
      tokenService.setTokens(accessToken, newRefreshToken);
      
      // Update user with new token
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser });
      }
      
      return true;
    } catch {
      // Refresh failed - clear session
      tokenService.clearAuthTokens();
      useAuthStore.getState().clearSession();
      return false;
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/auth/me');
    useAuthStore.getState().setUser(response.data);
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>('/api/v1/auth/me', data);
    useAuthStore.getState().setUser(response.data);
    return response.data;
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/api/v1/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/api/v1/auth/reset-password', { token, password });
  },

  /**
   * Change password (requires current password)
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/change-password', data);
  },

  /**
   * Resend verification email
   */
  async resendVerification(): Promise<void> {
    await apiClient.post('/api/v1/auth/resend-verification');
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/api/v1/auth/verify-email', { token });
  },

  /**
   * Check if user is authenticated and token is valid
   */
  async checkAuth(): Promise<boolean> {
    if (!tokenService.isAuthenticated()) {
      return false;
    }

    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};

// Default export
export default authService;
