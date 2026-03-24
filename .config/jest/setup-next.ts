/**
 * FieldCore - Jest Next.js Setup
 * Mocks and utilities for Next.js frontend tests
 */

// ============================================
// Next.js Router Mocks
// ============================================

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isPreview: false,
  isReady: true,
  basePath: '',
  locale: 'es',
  locales: ['es', 'en'],
  defaultLocale: 'es',
  domainLocales: [],
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
  notFound: jest.fn(() => {
    const error = new Error('Not Found');
    error.name = 'NotFoundError';
    throw error;
  }),
  permanentRedirect: jest.fn(),
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
  })),
}));

// ============================================
// API Client Mock
// ============================================

export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn(),
};

jest.mock('@/lib/api-client', () => ({
  apiClient: mockApiClient,
  getApiClient: jest.fn(() => mockApiClient),
}));

// ============================================
// Auth Store Mock
// ============================================

export const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  checkAuth: jest.fn(),
  setUser: jest.fn(),
};

jest.mock('@/store/auth.store', () => ({
  useAuthStore: () => mockAuthStore,
}));

// ============================================
// Toast Notifications Mock (sonner)
// ============================================

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn((message: string) => console.log(`✓ ${message}`)),
    error: jest.fn((message: string) => console.error(`✗ ${message}`)),
    info: jest.fn((message: string) => console.info(`ℹ ${message}`)),
    warning: jest.fn((message: string) => console.warn(`⚠ ${message}`)),
    promise: jest.fn((promise: Promise<unknown>, messages: { loading: string; success: string; error: string }) => promise),
  },
  toaster: jest.fn(),
}));

// ============================================
// Browser APIs Mocks
// ============================================

class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    private callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {}

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(): IntersectionObserverEntry[] => [];
}

class MockResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ============================================
// Web APIs Mocks
// ============================================

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}));

// ============================================
// React Testing Library Extensions
// ============================================

import '@testing-library/jest-dom';

// ============================================
// Cleanup
// ============================================

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
