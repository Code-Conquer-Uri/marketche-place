import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig(() => {
  return {
    root: ".",
    input: {
      path: "../api/swagger.json",
    },
    output: {
      path: "./src/http",
    },
    plugins: [
      pluginOas({
        generators: [],
        validate: false,
      }),

      pluginTs({
        output: {
          path: "./types",
        },
      }),

      pluginClient({
        output: {
          path: "./requests",
        },
        dataReturnType: "full",
        importPath: "@/lib/api-client",
      }),
    ],
  };
});
