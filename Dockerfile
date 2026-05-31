# ==========================================
# Stage 1: Build Frontend (Vite + React)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source files and build
COPY client/ ./
ENV VITE_API_URL=/api
RUN npm run build

# ==========================================
# Stage 2: Setup Server & Run Fullstack
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Copy built frontend assets into the server's public directory for static serving
COPY --from=frontend-builder /app/client/dist ./server/public

# Expose default backend port
EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

# Start Express server, which serves both API and static frontend assets
CMD ["node", "server/index.js"]
