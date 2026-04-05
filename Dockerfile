FROM node:24-alpine AS base

# ----------------------------
# Stage 1: Install all dependencies
# ----------------------------
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ----------------------------
# Stage 2: Build the application
# ----------------------------
FROM deps AS build
WORKDIR /app
COPY . .
RUN node ace build

# ----------------------------
# Stage 3: Production dependencies
# ----------------------------
FROM base AS prod-deps
WORKDIR /app
COPY --from=build /app/build/package*.json ./
RUN npm ci --omit=dev

# ----------------------------
# Stage 4: Production runtime
# ----------------------------
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./

EXPOSE 3333
CMD ["node", "bin/server.js"]
