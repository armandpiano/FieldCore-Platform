/**
 * FieldCore - Commitlint Configuration
 * Conventional Commits specification for commit messages
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type enum
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that do not affect meaning (formatting, semi-colons, etc)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding missing tests or correcting existing tests
        'build',    // Changes that affect build system or dependencies
        'ci',       // Changes to CI configuration files and scripts
        'chore',    // Other changes that don't modify src or test files
        'revert',   // Reverts a previous commit
        'wip',      // Work in progress
        'hotfix',   // Critical hotfix
        'deps',     // Dependency updates
      ],
    ],
    // Type case
    'type-case': [2, 'always', 'lower-case'],
    // Type empty
    'type-empty': [2, 'never'],
    // Subject case (allow various cases for technical terms)
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    // Subject empty
    'subject-empty': [2, 'never'],
    // Subject full-stop
    'subject-full-stop': [2, 'never', '.'],
    // Header full width (72 chars max)
    'header-max-length': [2, 'always', 100],
    // Body leading blank
    'body-leading-blank': [2, 'always'],
    // Footer leading blank
    'footer-leading-blank': [1, 'always'],
    // References empty
    'references-empty': [2, 'never'],
  },
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      customScope: 'Denote the SCOPE of this change (optional):',
      description: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: 'Select the ISSUES type of change by this change (optional):',
      customFooterPrefix: 'Input ISSUES prefix:\n',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      generatingByAI: 'Generate your commit message using AI? (default is No)',
      generatedCommitByAI: 'AI generated commit message:',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    types: {
      feat: { description: 'A new feature', title: 'Features' },
      fix: { description: 'A bug fix', title: 'Bug Fixes' },
      docs: { description: 'Documentation only changes', title: 'Documentation' },
      style: {
        description: 'Changes that do not affect the meaning of the code',
        title: 'Styles',
      },
      refactor: { description: 'A code change that neither fixes a bug nor adds a feature', title: 'Code Refactoring' },
      perf: { description: 'A code change that improves performance', title: 'Performance Improvements' },
      test: { description: 'Adding missing tests or correcting existing tests', title: 'Tests' },
      build: { description: 'Changes that affect the build system or dependencies', title: 'Builds' },
      ci: { description: 'Changes to CI configuration files and scripts', title: 'Continuous Integrations' },
      chore: { description: "Other changes that don't modify src or test files", title: 'Chores' },
      revert: { description: 'Reverts a previous commit', title: 'Reverts' },
      wip: { description: 'Work in progress', title: 'Work in Progress' },
      hotfix: { description: 'Critical hotfix', title: 'Hotfixes' },
      deps: { description: 'Dependency updates', title: 'Dependencies' },
    },
    useEmoji: false,
    scopes: {
      api: 'API / Backend',
      web: 'Web / Frontend',
      shared: 'Shared / Types',
      infra: 'Infrastructure',
      auth: 'Authentication',
      db: 'Database / Prisma',
      docker: 'Docker / Containerization',
      ci: 'CI / CD',
      docs: 'Documentation',
      deps: 'Dependencies',
    },
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom.scope',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix', 'perf', 'refactor'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [{ value: 'closed', name: 'closed   | Closes #OOO' }],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    maxHeaderLength: 100,
    maxSubjectLength: 100,
    minSubjectLength: 3,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
};
