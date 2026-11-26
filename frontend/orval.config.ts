import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://localhost:4000/docs-json",
    output: {
      target: "./src/shared/api/generated/api.ts",
      schemas: "./src/shared/api/generated/types",
      client: "react-query",
      mode: "tags-split",
      httpClient: "fetch",
      clean: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
          useRuntimeFetcher: true,
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
