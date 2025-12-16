# ============================================================================
# BACKEND DOCKERFILE (Hono + Bun)
# ============================================================================
# Multi-stage build for optimized production image
# ============================================================================

# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM oven/bun:1-alpine AS deps

WORKDIR /app

# Install pnpm 10.16.1 using standalone binary (detect architecture)
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ]; then PNPM_ARCH="arm64"; else PNPM_ARCH="x64"; fi && \
    wget -qO /usr/local/bin/pnpm "https://github.com/pnpm/pnpm/releases/download/v10.16.1/pnpm-linuxstatic-${PNPM_ARCH}" && \
    chmod +x /usr/local/bin/pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Copy package.json files from all workspaces
COPY apps/server/package.json ./apps/server/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/ai/package.json ./packages/ai/
COPY packages/config/package.json ./packages/config/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile --filter server --filter @idea-sieve/db --filter @idea-sieve/env --filter @idea-sieve/ai

# ============================================================================
# Stage 2: Database Setup & Prisma Generation
# ============================================================================
FROM oven/bun:1-alpine AS prisma

WORKDIR /app

# Copy dependency files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy source files needed for Prisma
COPY packages/db ./packages/db
COPY packages/env ./packages/env
COPY packages/config ./packages/config

# Generate Prisma Client
# Set dummy DATABASE_URL for build-time generation (not used for actual connection)
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
RUN cd packages/db && bunx prisma generate

# ============================================================================
# Stage 3: Builder
# ============================================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependencies and generated Prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=prisma /app/packages/db ./packages/db

# Copy all workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY apps/server ./apps/server
COPY packages/env ./packages/env
COPY packages/ai ./packages/ai
COPY packages/config ./packages/config

# Build the server
WORKDIR /app/apps/server
RUN bun run build

# ============================================================================
# Stage 4: Production Runner
# ============================================================================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bunuser -u 1001

# Copy only production dependencies and built files
COPY --from=builder --chown=bunuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=bunuser:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=bunuser:nodejs /app/apps/server/package.json ./apps/server/
COPY --from=builder --chown=bunuser:nodejs /app/packages ./packages

# Set working directory to server
WORKDIR /app/apps/server

# Switch to non-root user
USER bunuser

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/health').then(() => process.exit(0)).catch(() => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["bun", "run", "dist/index.js"]
