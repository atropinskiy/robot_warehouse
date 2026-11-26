import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
  // Cache Components / Partial Prefetching отключены: instant-navigation
  // валидация ругается на сегменты, которые рендерятся только после
  // проверки сессии на клиенте (auth-гейты в layout'ах).
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const authToken = process.env.SENTRY_AUTH_TOKEN;
const org = process.env.SENTRY_ORG;
const project = process.env.SENTRY_PROJECT;
const sentryUrl = process.env.SENTRY_URL;

const uploadSourceMaps = Boolean(authToken);

if (uploadSourceMaps && (!org || !project || !sentryUrl)) {
  throw new Error(
    "Source map upload requires SENTRY_ORG, SENTRY_PROJECT and SENTRY_URL",
  );
}

export default withSentryConfig(nextConfig, {
  authToken,
  org,
  project,
  sentryUrl,

  telemetry: false,
  silent: false,

  release: {
    create: uploadSourceMaps,
    finalize: uploadSourceMaps,
  },

  sourcemaps: {
    disable: !uploadSourceMaps,
    deleteSourcemapsAfterUpload: true,
  },

  errorHandler: (error) => {
    throw error;
  },
});
