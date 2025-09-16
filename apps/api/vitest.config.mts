import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    exclude: [...configDefaults.exclude, "**/data/pg/**"],
    pool: "forks",
    poolOptions: {
      forks: {
        isolate: true,
      },
    },
    sequence: {
      shuffle: !process.env.CI,
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
