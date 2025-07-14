import { expect, test } from '@playwright/test';
import { routes } from '../src/routes/routes';

test.beforeEach(async ({ page }) => {
    // with "/" you are navigating to the base url defined in playwright config
    await page.goto('/');
});

test.describe('Visual Snapshots', () => {
    test('home page snapshot', async ({ page }) => {
        // Navigate to home page
        await page.goto('/');
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Ensure no error boundary is displayed
        const errorBoundary = page.locator('text=Stacktrace:');
        await expect(errorBoundary).toBeHidden();
        
        // Ensure no error message is displayed 
        const errorText = page.locator('text=[Error]');
        await expect(errorText).toBeHidden();
        
        // Take screenshot
        await expect(page).toHaveScreenshot('home-page.png');
    });

    test('test page snapshot', async ({ page }) => {
        // Navigate to test page
        await page.goto('/test');
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Ensure no error boundary is displayed
        const errorBoundary = page.locator('text=Stacktrace:');
        await expect(errorBoundary).toBeHidden();
        
        // Ensure no error message is displayed
        const errorText = page.locator('text=[Error]');
        await expect(errorText).toBeHidden();
        
        // Take screenshot
        await expect(page).toHaveScreenshot('test-page.png');
    });

    test('home page navigation elements visible', async ({ page }) => {
        // Navigate to home page
        await page.goto('/');
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Verify key navigation elements are present (but not errored)
        const testrouteBtn = page.getByRole('button', { name: 'Testroute', exact: true });
        await expect(testrouteBtn).toBeVisible();
        
        // Ensure no error states are visible
        const errorBoundary = page.locator('text=Stacktrace:');
        await expect(errorBoundary).toBeHidden();
        
        // Take focused screenshot of main content area
        await expect(page.locator('main, [role="main"], body')).toHaveScreenshot('home-content.png');
    });

    test('test page navigation elements visible', async ({ page }) => {
        // Navigate to test page
        await page.goto('/test');
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Verify test page elements are present
        const homeNavigation = page.locator('text=Home');
        await expect(homeNavigation).toBeVisible();
        
        // Verify test buttons are present (but don't click the error-generating ones)
        const testWarningBtn = page.locator('#button_test0');
        await expect(testWarningBtn).toBeVisible();
        
        // Ensure no error states are visible
        const errorBoundary = page.locator('text=Stacktrace:');
        await expect(errorBoundary).toBeHidden();
        
        // Take focused screenshot of main content area
        await expect(page.locator('main, [role="main"], body')).toHaveScreenshot('test-content.png');
    });
});