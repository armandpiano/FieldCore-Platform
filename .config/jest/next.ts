/**
 * FieldCore - Jest Next.js Configuration
 * Specific configuration for Next.js frontend testing
 */
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './apps/web',
});

const config: Config = {
  // Use jsdom for React Testing Library
  testEnvironment: 'jsdom',

  // Extended setup files
  setupFilesAfterEnv: ['<rootDir>/.config/jest/setup-next.ts'],

  // Module name mapper for Next.js aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^~/(.*)$': '<rootDir>/apps/web/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/.config/jest/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/.config/jest/__mocks__/fileMock.js',
    '\\.(pdf|doc|docx)$': '<rootDir>/.config/jest/__mocks__/fileMock.js',
  },

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: [
    'apps/web/src/**/*.{ts,tsx}',
    '!apps/web/src/**/*.d.ts',
    '!apps/web/src/**/index.ts',
    '!apps/web/src/**/*.stories.{ts,tsx}',
    '!apps/web/src/**/types/**',
    '!apps/web/src/**/*.config.{ts,js}',
  ],

  // Transform
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'apps/web/tsconfig.json',
      useESM: false,
    }],
  },

  // Test match patterns
  testMatch: [
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],

  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/dist/',
  ],

  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>'],

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Force exit after tests
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,
};

export default createJestConfig(config);
