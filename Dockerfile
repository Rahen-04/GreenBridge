# Multi-stage production build for GreenBridge
# Stage 1: Build frontend and generate Prisma client
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# Generate Prisma Client (default supports PostgreSQL for production cloud deployment)
ARG DATABASE_PROVIDER=postgresql
RUN if [ "$DATABASE_PROVIDER" = "postgresql" ]; then \
      npx prisma generate --schema=prisma/schema.postgresql.prisma; \
    else \
      npx prisma generate --schema=prisma/schema.prisma; \
    fi

# Build production Vite bundle into /app/dist
RUN npm run build

# Stage 2: Lightweight production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies and tsx / prisma for runtime execution
RUN npm ci --omit=dev && npm install -g tsx prisma

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy backend server sources and TypeScript config
COPY server ./server
COPY tsconfig*.json ./

EXPOSE 3001

# Auto-migrate database schema (PostgreSQL if DATABASE_URL provided, else SQLite) and launch server
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ] && echo \"$DATABASE_URL\" | grep -q 'postgres'; then npx prisma db push --schema=prisma/schema.postgresql.prisma; else npx prisma db push --schema=prisma/schema.prisma; fi && tsx server/index.ts"]
