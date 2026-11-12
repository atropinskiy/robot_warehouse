type Env = Record<string, string | undefined>;

const REQUIRED = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
] as const;

export function validateEnv(config: Env): Env {
  const missing = REQUIRED.filter((k) => !config[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  if (!config.DATABASE_URL!.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must start with postgresql://');
  }

  const port = Number(config.PORT);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT: ${config.PORT}`);
  }

  return config;
}
