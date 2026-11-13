FROM node:26-alpine AS base
RUN npm install --global pnpm@12.18.0
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml ./ 

RUN --mount=type=cache,id=pnpm-backend,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY backend/ ./
CMD ["pnpm", "start:dev"]
