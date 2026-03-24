import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('fieldcore_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const orgId = Cookies.get('fieldcore_organization_id');
  if (orgId) config.headers['X-Organization-Id'] = orgId;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refreshToken: Cookies.get('fieldcore_refresh_token'),
        });
        Cookies.set('fieldcore_access_token', data.accessToken, { expires: 1 / 24 });
        Cookies.set('fieldcore_refresh_token', data.refreshToken, { expires: 7 });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        Cookies.remove('fieldcore_access_token');
        Cookies.remove('fieldcore_refresh_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const tokenService = {
  setTokens(accessToken: string, refreshToken: string) {
    Cookies.set('fieldcore_access_token', accessToken, { expires: 1 / 24 });
    Cookies.set('fieldcore_refresh_token', refreshToken, { expires: 7 });
  },
  setOrganizationId(id: string) { Cookies.set('fieldcore_organization_id', id, { expires: 7 }); },
  clearAuthTokens() {
    Cookies.remove('fieldcore_access_token');
    Cookies.remove('fieldcore_refresh_token');
    Cookies.remove('fieldcore_organization_id');
  },
  isAuthenticated: () => !!Cookies.get('fieldcore_access_token'),
};

export default apiClient;
