import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    timeout: 20000,
    testDir: 'playwrightTests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['line'], ['html', { outputFolder: 'playwrightTests/test-reports/' }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.URL || 'http://localhost:4173',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        video: 'on-first-retry',
        
        /* Screenshot settings for visual testing */
        screenshot: 'only-on-failure',
    },

    /* Global test configuration for expect */
    expect: {
        /* Threshold for visual comparisons */
        threshold: 0.2,
        /* Timeout for expect assertions */
        timeout: 10000,
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // webServer: {
    //     command: 'npm run preview',
    //     url: 'http://127.0.0.1:4173',
    //     reuseExistingServer: !process.env.CI,
    // },
});
