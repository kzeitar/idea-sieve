# Contributing to Idea Sieve

First off, thank you for considering contributing to Idea Sieve! It's people like you that make Idea Sieve such a great tool. 🎉

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
### Description
A clear and concise description of the bug.

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior
What you expected to happen.

### Actual Behavior
What actually happened.

### Screenshots
If applicable, add screenshots to help explain your problem.

### Environment
- OS: [e.g., macOS 13.0, Ubuntu 22.04]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node.js version: [e.g., 18.17.0]
- Docker version: [if applicable]

### Additional Context
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

**Enhancement Template:**

```markdown
### Feature Description
A clear and concise description of the feature you'd like to see.

### Problem It Solves
Describe the problem this feature would solve.

### Proposed Solution
Describe how you envision this feature working.

### Alternatives Considered
Describe any alternative solutions you've considered.

### Additional Context
Add any other context, mockups, or examples.
```

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues for newcomers
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Set up your development environment** (see [Development Setup](#development-setup))
3. **Make your changes** following our [Style Guidelines](#style-guidelines)
4. **Test your changes** thoroughly
5. **Run linting and type checking**: `pnpm run check && pnpm run check-types`
6. **Commit your changes** with clear commit messages
7. **Push to your fork** and submit a pull request

**Pull Request Template:**

```markdown
### Description
Describe what this PR does and why.

### Related Issues
Fixes #(issue number)

### Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

### How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

### Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have run `pnpm run check` and `pnpm run check-types`
- [ ] Any dependent changes have been merged and published

### Screenshots (if applicable)
Add screenshots to help reviewers understand your changes.
```

## Development Setup

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **pnpm** 8+
- **Docker** and **Docker Compose** (optional, but recommended)
- **PostgreSQL** 14+ (if not using Docker)

### Quick Setup with Docker

```bash
# 1. Clone your fork
git clone https://github.com/kzeitar/idea-sieve.git
cd idea-sieve

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env and add your API keys

# 4. Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Manual Setup

```bash
# 1. Clone your fork
git clone https://github.com/kzeitar/idea-sieve.git
cd idea-sieve

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
# Edit the .env files and add your API keys

# 4. Start PostgreSQL
pnpm run db:start

# 5. Push database schema
pnpm run db:push

# 6. Start development servers
pnpm run dev
```

### Useful Commands

```bash
# Development
pnpm run dev                    # Start all services
pnpm run dev:web                # Start frontend only
pnpm run dev:server             # Start backend only

# Code Quality
pnpm run check                  # Run linting and formatting
pnpm run check-types            # Type check all packages

# Database
pnpm run db:studio              # Open Prisma Studio
pnpm run db:push                # Push schema changes
pnpm run db:generate            # Generate Prisma client

# Building
pnpm run build                  # Build all packages

# Docker
docker-compose up --build       # Rebuild and start
docker-compose logs -f service  # View service logs
```

## Style Guidelines

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

**Examples:**
```bash
feat(validation): add support for custom validation frameworks
fix(api): correct error handling in SSE stream
docs: update Docker setup instructions
refactor(db): simplify Prisma schema
perf(ai): optimize OpenAI API calls with caching
```

### TypeScript Style Guide

We use **Biome** for linting and formatting. Run `pnpm run check` before committing.

**Key Conventions:**

1. **Use TypeScript strictly**
   ```typescript
   // Good
   function validateIdea(idea: Idea): ValidationReport {
     // ...
   }

   // Bad
   function validateIdea(idea: any): any {
     // ...
   }
   ```

2. **Prefer explicit types over inference when it improves clarity**
   ```typescript
   // Good
   const ideas: Idea[] = await db.idea.findMany();

   // Also acceptable
   const ideas = await db.idea.findMany();
   ```

3. **Use async/await over promises**
   ```typescript
   // Good
   async function getIdea(id: string) {
     const idea = await db.idea.findUnique({ where: { id } });
     return idea;
   }

   // Avoid
   function getIdea(id: string) {
     return db.idea.findUnique({ where: { id } }).then(idea => idea);
   }
   ```

4. **Handle errors properly**
   ```typescript
   // Good
   try {
     const result = await riskyOperation();
     return result;
   } catch (error) {
     console.error('Operation failed:', error);
     throw new Error('Failed to complete operation');
   }

   // Bad
   const result = await riskyOperation(); // Unhandled promise rejection
   ```

5. **Use meaningful variable names**
   ```typescript
   // Good
   const validationReport = await generateReport(idea);

   // Bad
   const vr = await generateReport(idea);
   ```

### React/Frontend Conventions

1. **Use functional components with hooks**
2. **Co-locate related files** (component + styles + tests)
3. **Use TanStack Query** for server state
4. **Use Zod** for validation
5. **Prefer composition over inheritance**

### Backend/API Conventions

1. **Use Zod validators** on all endpoints
2. **Return consistent API responses**:
   ```typescript
   // Success
   { success: true, data: {...} }

   // Error
   { success: false, error: "Error message" }
   ```
3. **Use appropriate HTTP status codes**
4. **Document API endpoints** with JSDoc comments

## Project Structure

```
idea-sieve/
├── apps/
│   ├── web/                  # React frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── routes/      # TanStack Router routes
│   │   │   ├── lib/         # Utilities and helpers
│   │   │   └── hooks/       # Custom React hooks
│   │   └── Dockerfile
│   └── server/              # Hono backend
│       ├── src/
│       │   ├── routes/      # API route handlers
│       │   ├── services/    # Business logic
│       │   └── index.ts     # Entry point
│       └── Dockerfile
├── packages/
│   ├── ai/                  # AI validation logic
│   │   ├── src/
│   │   │   ├── services/    # Validation agents
│   │   │   ├── prompts/     # AI prompts
│   │   │   └── types.ts     # Type definitions
│   ├── db/                  # Database layer
│   │   ├── prisma/          # Prisma schema
│   │   ├── data/            # Seed data
│   │   └── src/             # Database utilities
│   ├── env/                 # Environment validation
│   └── config/              # Shared configs
```

## Testing Guidelines

### Writing Tests

1. **Test files** should be co-located with the code they test:
   ```
   validation.service.ts
   validation.service.test.ts
   ```

2. **Test naming** should follow AAA pattern:
   ```typescript
   describe('ValidationService', () => {
     it('should validate idea successfully when all criteria are met', async () => {
       // Arrange
       const idea = createMockIdea();

       // Act
       const result = await validateIdea(idea);

       // Assert
       expect(result.overallScore).toBeGreaterThan(7);
     });
   });
   ```

3. **Mock external dependencies**:
   ```typescript
   vi.mock('@ai-sdk/openai', () => ({
     createOpenAI: vi.fn().mockReturnValue({
       // mock implementation
     })
   }));
   ```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @idea-sieve/ai test
```

## Questions?

Don't hesitate to ask questions by:
- Opening a [GitHub Discussion](https://github.com/kzeitar/idea-sieve/discussions)
- Commenting on relevant issues

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Our community showcase

Thank you for contributing! 🚀
