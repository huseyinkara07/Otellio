import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testler saf lib fonksiyonlarini hedefler (UI/DB bagimliligi yok);
// bu yuzden node ortami yeterlidir, jsdom gerekmez.
export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.dirname(fileURLToPath(import.meta.url)),
    },
  },
});
