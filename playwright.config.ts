import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 120_000,
  use: { ...devices["iPhone 15 Pro"], viewport: { width: 393, height: 852 }, baseURL: "http://localhost:4173" },
  projects: [
    { name: "light", use: { browserName: "webkit", colorScheme: "light" } },
    { name: "dark", use: { browserName: "webkit", colorScheme: "dark" } },
  ],
  webServer: { command: "npx vite preview --port 4173", port: 4173, reuseExistingServer: true },
});
