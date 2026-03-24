/**
 * FieldCore - Jest Base Configuration
 * Shared Jest configuration for the monorepo
 */
import type { Config } from 'jest';

const config: Config = {
  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/src/**/*.module.ts',
    '!**/src/main.ts',
    '!**/src/**/index.ts',
  ],

  // Test match patterns
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  // Transform files
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: false,
      },
    ],
  },

  // Module name mapper
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@fieldcore/(.*)$': '<rootDir>/packages/$1/src',
    '^~/(.*)$': '<rootDir>/src/$1',
  },

  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid)/)',
  ],

  // Test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Detect open handles (for debugging)
  detectOpenHandles: true,

  // Force exit after tests complete (for CI)
  forceExit: true,

  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' > ',
        usePathForSuiteName: true,
      },
    ],
  ],
};

export default config;
