# ============================================================================
# FRONTEND DOCKERFILE (React + Vite)
# ============================================================================
# Multi-stage build for optimized production image
# ============================================================================

# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Copy package.json files from all workspaces needed for web
COPY apps/web/package.json ./apps/web/
COPY packages/env/package.json ./packages/env/
COPY packages/ai/package.json ./packages/ai/
COPY packages/db/package.json ./packages/db/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter web

# ============================================================================
# Stage 2: Database Setup & Prisma Generation (needed for types)
# ============================================================================
FROM node:22-alpine AS prisma

WORKDIR /app

# Copy dependency files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy source files needed for Prisma
COPY packages/db ./packages/db
COPY packages/env ./packages/env
COPY packages/config ./packages/config

# Generate Prisma Client (needed for type definitions)
# Set dummy DATABASE_URL for build-time generation (not used for actual connection)
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
RUN cd packages/db && npx prisma generate

# ============================================================================
# Stage 3: Builder
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies and generated Prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=prisma /app/packages/db ./packages/db

# Copy all workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY apps/web ./apps/web
COPY packages/env ./packages/env
COPY packages/ai ./packages/ai
COPY packages/config ./packages/config

# Set build-time environment variable for API URL
# This will be replaced at runtime by nginx
ARG VITE_SERVER_URL=http://localhost:3000
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Build the web application
WORKDIR /app/apps/web
RUN pnpm run build

# ============================================================================
# Stage 4: Production Runner (nginx)
# ============================================================================
FROM nginx:alpine AS runner

# Install nodejs for runtime env var substitution
RUN apk add --no-cache nodejs

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Copy built assets from builder
COPY --from=builder --chown=nginx-user:nginx-user /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Create a startup script to inject runtime environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'echo "Injecting runtime environment variables..."' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_SERVER_URL_PLACEHOLDER|${VITE_SERVER_URL}|g" {} \;' >> /docker-entrypoint.sh && \
    echo 'echo "Starting nginx..."' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx with the startup script
CMD ["/docker-entrypoint.sh"]
