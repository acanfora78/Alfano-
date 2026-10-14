import { defineConfig, devices } from "@playwright/test";

/**
 * Test end-to-end. Avviare prima il sito con l'inventario di test:
 *   VEHICLES_FILE=$PWD/tests/fixtures/vehicles.qa.json npm run build && \
 *   VEHICLES_FILE=$PWD/tests/fixtures/vehicles.qa.json npm start -- -p 3100
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: process.env.BASE_URL || "http://localhost:3100", trace: "off" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
