# Test info

- Name: Visual Snapshots >> home page snapshot
- Location: /home/runner/work/react/react/playwrightTests/snapshots.spec.ts:10:5

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { expect, test } from '@playwright/test';
   2 | import { routes } from '../src/routes/routes';
   3 |
   4 | test.beforeEach(async ({ page }) => {
   5 |     // with "/" you are navigating to the base url defined in playwright config
   6 |     await page.goto('/');
   7 | });
   8 |
   9 | test.describe('Visual Snapshots', () => {
> 10 |     test('home page snapshot', async ({ page }) => {
     |     ^ Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
  11 |         // Navigate to home page
  12 |         await page.goto('/');
  13 |         
  14 |         // Wait for page to be fully loaded
  15 |         await page.waitForLoadState('networkidle');
  16 |         
  17 |         // Ensure no error boundary is displayed
  18 |         const errorBoundary = page.locator('text=Stacktrace:');
  19 |         await expect(errorBoundary).toBeHidden();
  20 |         
  21 |         // Ensure no error message is displayed 
  22 |         const errorText = page.locator('text=[Error]');
  23 |         await expect(errorText).toBeHidden();
  24 |         
  25 |         // Take screenshot
  26 |         await expect(page).toHaveScreenshot('home-page.png');
  27 |     });
  28 |
  29 |     test('test page snapshot', async ({ page }) => {
  30 |         // Navigate to test page
  31 |         await page.goto('/test');
  32 |         
  33 |         // Wait for page to be fully loaded
  34 |         await page.waitForLoadState('networkidle');
  35 |         
  36 |         // Ensure no error boundary is displayed
  37 |         const errorBoundary = page.locator('text=Stacktrace:');
  38 |         await expect(errorBoundary).toBeHidden();
  39 |         
  40 |         // Ensure no error message is displayed
  41 |         const errorText = page.locator('text=[Error]');
  42 |         await expect(errorText).toBeHidden();
  43 |         
  44 |         // Take screenshot
  45 |         await expect(page).toHaveScreenshot('test-page.png');
  46 |     });
  47 |
  48 |     test('home page navigation elements visible', async ({ page }) => {
  49 |         // Navigate to home page
  50 |         await page.goto('/');
  51 |         
  52 |         // Wait for page to be fully loaded
  53 |         await page.waitForLoadState('networkidle');
  54 |         
  55 |         // Verify key navigation elements are present (but not errored)
  56 |         const testrouteBtn = page.getByRole('button', { name: 'Testroute', exact: true });
  57 |         await expect(testrouteBtn).toBeVisible();
  58 |         
  59 |         // Ensure no error states are visible
  60 |         const errorBoundary = page.locator('text=Stacktrace:');
  61 |         await expect(errorBoundary).toBeHidden();
  62 |         
  63 |         // Take focused screenshot of main content area
  64 |         await expect(page.locator('main, [role="main"], body')).toHaveScreenshot('home-content.png');
  65 |     });
  66 |
  67 |     test('test page navigation elements visible', async ({ page }) => {
  68 |         // Navigate to test page
  69 |         await page.goto('/test');
  70 |         
  71 |         // Wait for page to be fully loaded
  72 |         await page.waitForLoadState('networkidle');
  73 |         
  74 |         // Verify test page elements are present
  75 |         const homeNavigation = page.locator('text=Home');
  76 |         await expect(homeNavigation).toBeVisible();
  77 |         
  78 |         // Verify test buttons are present (but don't click the error-generating ones)
  79 |         const testWarningBtn = page.locator('#button_test0');
  80 |         await expect(testWarningBtn).toBeVisible();
  81 |         
  82 |         // Ensure no error states are visible
  83 |         const errorBoundary = page.locator('text=Stacktrace:');
  84 |         await expect(errorBoundary).toBeHidden();
  85 |         
  86 |         // Take focused screenshot of main content area
  87 |         await expect(page.locator('main, [role="main"], body')).toHaveScreenshot('test-content.png');
  88 |     });
  89 | });
```