import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  cacheDir: "build/vitest",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx,mjs}"],
    environment: "jsdom",
    setupFiles: ["./tests/unit/setup.ts"],
  },
})
