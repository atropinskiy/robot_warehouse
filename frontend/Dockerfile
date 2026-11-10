FROM node:26-alpine AS base
RUN npm install --global pnpm@12.18.0
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm-frontend,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY frontend/ ./
CMD ["pnpm", "dev"]