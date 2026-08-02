# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy and install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy only what is needed from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Don't run as root
RUN addgroup -S zengroup && adduser -S zenuser -G zengroup
USER zenuser

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
