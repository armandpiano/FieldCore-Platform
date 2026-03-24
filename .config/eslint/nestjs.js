/**
 * FieldCore - ESLint NestJS Configuration
 * Specific rules for the NestJS backend application
 */
module.exports = {
  extends: ['./base.js'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // NestJS specific rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Allow DTO properties to start with numbers
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'property',
        leadingUnderscore: 'allow',
        format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
        suffix: ['DTO', 'VO', 'Entity', 'Repository', 'Service', 'Controller', 'Module', 'Guard', 'Interceptor', 'Decorator'],
      },
    ],

    // NestJS: Allow parameter properties
    'no-useless-constructor': 'off',

    // Import rules
    'import/no-cycle': 'off', // Allow circular deps in NestJS modules
    'import/prefer-default-export': 'off',

    // Class method naming
    'class-methods-use-this': 'off',

    // Max lines per file (soft limit for controllers/services)
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],

    // Complexity
    'max-complexity': ['warn', 15],

    // Allow early returns in guards and interceptors
    'consistent-return': 'off',
  },
  overrides: [
    {
      files: ['*.entity.ts', '*.repository.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    {
      files: ['*.module.ts'],
      rules: {
        'max-lines': 'off',
        'max-complexity': 'off',
      },
    },
    {
      files: ['*.spec.ts', '*.e2e-spec.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'max-lines': 'off',
        'max-complexity': 'off',
        'max-nested-callbacks': 'off',
        'no-magic-numbers': 'off',
      },
    },
  ],
};
