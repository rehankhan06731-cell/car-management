# ---- Build stage (none needed, we just copy source) ----
FROM node:20-alpine AS base

WORKDIR /app

# Install only production deps
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy source files
COPY backend/src ./src
COPY backend/.env.example ./.env.example   # kept for reference only

EXPOSE 5000

CMD ["node", "src/server.js"]
