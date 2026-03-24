# FieldCore - Quality Infrastructure

## Overview

This directory contains the quality infrastructure for the FieldCore monorepo, including linting, formatting, testing, and git hooks.

## Structure

```
.config/
├── eslint/
│   ├── base.js      # Base ESLint configuration
│   ├── next.js      # Next.js specific ESLint rules
│   └── nestjs.js    # NestJS specific ESLint rules
├── prettier/
│   └── index.js     # Prettier configuration
├── commitlint/
│   └── commitlint.config.js  # Conventional commits config
├── jest/
│   ├── jest.config.ts        # Base Jest configuration
│   ├── setup.ts              # Base Jest setup with mocks
│   ├── next.ts               # Next.js Jest configuration
│   ├── setup-next.ts         # Next.js Jest setup
│   └── __mocks__/           # Jest mocks
└── quality/
    └── README.md            # This file

.husky/
├── prepare.sh       # Husky initialization script
├── pre-commit       # Pre-commit hook
└── commit-msg       # Commit message validation hook

.lintstagedrc.json   # lint-staged configuration
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

This will:
- Install all dependencies including husky
- Run `husky install` via the `prepare` script
- Set up git hooks in `.husky/`

### 2. Manual Hook Setup (if needed)

```bash
pnpm prepare
```

## Usage

### Linting

```bash
# Lint all packages
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Lint specific package
cd apps/web && pnpm lint
cd apps/api && pnpm lint
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific package tests
pnpm test:api
pnpm test:web
```

### Type Checking

```bash
# Type check all packages
pnpm typecheck

# Type check specific package
pnpm typecheck:web
pnpm typecheck:api
```

### Committing

We use Conventional Commits for commit messages.

```bash
# Interactive commit
pnpm commit

# Or use git directly
git commit -m "feat(auth): add login functionality"
```

### Git Hooks

#### Pre-commit Hook

Runs lint-staged on staged files before each commit.

#### Commit-msg Hook

Validates commit messages against Conventional Commits format.

To bypass hooks (not recommended):
```bash
git commit --no-verify -m "WIP: work in progress"
```

## Conventional Commits

Format: `<type>(<scope>): <description>`

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, no code change |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Build system changes |
| `ci` | CI/CD changes |
| `chore` | Maintenance tasks |
| `revert` | Reverting changes |
| `hotfix` | Critical hotfix |
| `deps` | Dependency updates |

### Scopes

| Scope | Description |
|-------|-------------|
| `api` | API / Backend |
| `web` | Web / Frontend |
| `shared` | Shared / Types |
| `infra` | Infrastructure |
| `auth` | Authentication |
| `db` | Database / Prisma |
| `docker` | Docker / Containerization |
| `ci` | CI / CD |
| `docs` | Documentation |
| `deps` | Dependencies |

### Examples

```bash
feat(auth): add JWT refresh token support
fix(clients): resolve pagination issue in client list
docs(api): update endpoint documentation
refactor(work-orders): simplify status transitions
style(web): format code with Prettier
test(api): add unit tests for user service
```

## Testing Strategy

### Unit Tests

- **Location**: `*.spec.ts` files co-located with source
- **Scope**: Individual functions, methods, classes
- **Mocking**: External dependencies (DB, Redis, external APIs)

### Integration Tests

- **Location**: `*.integration.spec.ts` in `tests/` directory
- **Scope**: API endpoints, database operations
- **Environment**: Uses test database

### E2E Tests

- **Location**: `apps/api/src/**/*.e2e-spec.ts`
- **Scope**: Full application flow
- **Environment**: Docker-based test environment

### Coverage Requirements

| Package | Minimum Coverage |
|---------|-----------------|
| API | 70% |
| Web | 50% |
| Shared | 80% |

## CI/CD Integration

### GitHub Actions

The quality checks run in the following order:

1. **Install** - `pnpm ci:install`
2. **Audit** - `pnpm ci:audit`
3. **Lint** - `pnpm ci:lint`
4. **Typecheck** - `pnpm ci:typecheck`
5. **Test** - `pnpm ci:test`
6. **Build** - `pnpm ci:build`

### Pre-production Checks

Before merging to `main`:
```bash
pnpm verify
```

## IDE Integration

### VS Code

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Recommended extensions:
- ESLint
- Prettier
- Jest Runner
- GitLens

## Troubleshooting

### Hooks not running

```bash
# Reinstall hooks
pnpm prepare

# Or manually
npx husky install
```

### Prettier conflicts with ESLint

If you see conflicts, check:
1. ESLint `rules` don't override Prettier's job
2. Use `eslint --fix` before `prettier --write`

### Tests failing

```bash
# Clear Jest cache
cd apps/api && npx jest --clearCache
cd apps/web && npx jest --clearCache

# Run tests with verbose output
pnpm test:api -- --verbose
```

## Resources

- [ESLint Documentation](https://eslint.org/docs/user-guide/configuring)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/lint-staged/lint-staged)
