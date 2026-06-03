import { defineConfig, devices } from '@playwright/test'

// Playwright E2E config — scoped to the ./e2e folder only, so it won't pick up
// or interfere with anything else in the repo. Run with: npm run test:e2e
export default defineConfig({
  testDir: './test_suites',
  outputDir: './test_suites/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    // Lets tests use page.goto('/') instead of hard-coding the host.
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Auto-starts the Next.js dev server before the tests and stops it after, so
  // `npm run test:e2e` is fully self-contained. If you already have `npm run dev`
  // running, it reuses that instead of starting a second one.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
