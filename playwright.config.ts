// SPDX-License-Identifier: GPL-2.0-or-later

import { defineConfig, devices } from "@playwright/test";

// CI runs all three engines. Locally, restrict with --project=chromium.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // On CI the list reporter also puts each test's time in the log, to show which are slow.
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:4173",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Lets a machine with a different pre-installed Chromium run the suite.
        launchOptions: process.env.CHROMIUM_PATH
          ? { executablePath: process.env.CHROMIUM_PATH }
          : {},
      },
    },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  // Set E2E_BASE_URL to test an already running server (for example the Docker container).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run preview -- --port 4173 --strictPort",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
