/// <reference types="vitest" />

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 2000,
    include: ["**/*.{test,spec,integration}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
  logLevel: "info",
  esbuild: {
    sourcemap: "both",
  },
});
