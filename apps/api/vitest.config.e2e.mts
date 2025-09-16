import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    exclude: [...configDefaults.exclude, "**/data/pg/**"],
    setupFiles: ["./test/setup-e2e.ts"],
    pool: "forks",
    poolOptions: {
      forks: {
        isolate: true,
      },
    },
    testTimeout: 15000,
    hookTimeout: 1000000,
    teardownTimeout: 5000,
    environmentMatchGlobs: [["**/*.e2e-spec.ts", "node"]],
    workspace: [
      {
        extends: true,
        test: {
          environment: "node",
        },
      },
    ],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
