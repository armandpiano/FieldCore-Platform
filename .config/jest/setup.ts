/**
 * FieldCore - Jest Base Setup
 * Global mocks and utilities for all tests
 */

// ============================================
// Environment Mocks
// ============================================

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  JWT_SECRET: 'test-jwt-secret-key-for-testing-only',
  JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-key-for-testing-only',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/fieldcore_test',
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  AWS_S3_BUCKET: 'fieldcore-test-bucket',
  AWS_REGION: 'us-east-1',
};

// ============================================
// Global Utilities
// ============================================

// Mock UUID generator
let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `test-uuid-${++mockUuidCounter}`,
  v1: () => `test-uuid-v1-${++mockUuidCounter}`,
}));

// Mock Date.now
const mockDate = new Date('2024-01-15T12:00:00Z');
const RealDate = Date;

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(mockDate);
});

afterAll(() => {
  jest.useRealTimers();
});

// ============================================
// Mock Data Factories
// ============================================

export const createMockUser = (overrides = {}) => ({
  id: 'user-001',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'technician',
  organizationId: 'org-001',
  isActive: true,
  createdAt: mockDate,
  updatedAt: mockDate,
  ...overrides,
});

export const createMockOrganization = (overrides = {}) => ({
  id: 'org-001',
  name: 'Test Organization',
  slug: 'test-org',
  plan: 'starter',
  isActive: true,
  settings: {},
  createdAt: mockDate,
  updatedAt: mockDate,
  ...overrides,
});

export const createMockClient = (overrides = {}) => ({
  id: 'client-001',
  organizationId: 'org-001',
  name: 'Test Client',
  email: 'client@example.com',
  phone: '+52 55 1234 5678',
  address: 'Test Address 123',
  latitude: 19.4326,
  longitude: -99.1332,
  isActive: true,
  createdAt: mockDate,
  updatedAt: mockDate,
  ...overrides,
});

export const createMockWorkOrder = (overrides = {}) => ({
  id: 'wo-001',
  organizationId: 'org-001',
  clientId: 'client-001',
  title: 'Test Work Order',
  description: 'Test description',
  status: 'pending',
  priority: 'medium',
  scheduledDate: mockDate,
  assignedTechnicianId: null,
  estimatedDuration: 60,
  actualDuration: null,
  completedAt: null,
  signatureUrl: null,
  rating: null,
  createdAt: mockDate,
  updatedAt: mockDate,
  ...overrides,
});

export const createMockEvidence = (overrides = {}) => ({
  id: 'evidence-001',
  workOrderId: 'wo-001',
  type: 'photo',
  url: 'https://storage.example.com/evidence/test.jpg',
  thumbnailUrl: 'https://storage.example.com/evidence/test-thumb.jpg',
  description: 'Test evidence',
  latitude: 19.4326,
  longitude: -99.1332,
  capturedAt: mockDate,
  createdAt: mockDate,
  ...overrides,
});

// ============================================
// Cleanup
// ============================================

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

// ============================================
// Console Mocks
// ============================================

// Suppress specific console outputs during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Suppress specific error patterns during tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
        args[0].includes('ReactDOM.render'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };

  console.warn = (...args: unknown[]) => {
    // Suppress specific warning patterns during tests
    if (typeof args[0] === 'string' && args[0].includes('deprecated')) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// ============================================
// Type declarations for Jest globals
// ============================================

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(min: number, max: number): R;
    }
  }
}

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be within range ${min} - ${max}`,
    };
  },
});
