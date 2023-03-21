import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "test/setup/setup.ts")],

    coverage: {
      provider: "istanbul", // or 'c8',
      all: true,
      reporter: ["text", "json", "html"],
    },
  },
});
