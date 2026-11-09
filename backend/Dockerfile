# syntax=docker/dockerfile:1
FROM node:26-alpine AS base
RUN npm install --global pnpm@10.13.1
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm-backend,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY backend/ ./
CMD ["pnpm", "start:dev"]
