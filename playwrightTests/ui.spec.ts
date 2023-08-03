// EXAMPLE_COMPONENT
import { expect, test } from '@playwright/test';
import { Routes } from '../src/routes/routes';

test.beforeEach(async ({ page }) => {
  // with "/" you are navigating to the base url defined in playwright config
  await page.goto('/');
});

test.describe('Routing', () => {
  test('routes are available', async ({ page }) => {
    const allRoutes: string[] = Object.values(Routes);
    await expect(page).toHaveURL('');
    for (const route of allRoutes) {
      await page.goto(`/${route}`);
      await expect(page).toHaveURL(`/${route}`);
    }
  });
  test('navigate to test route via button', async ({ page }) => {
    const testrouteBtn = page.getByRole('button', { name: 'Testroute', exact: true });
    await testrouteBtn.click();
    await expect(page).toHaveURL(`/test`);
    const backHomeBtn = page.getByRole('listitem').filter({ hasText: 'home' });
    await backHomeBtn.click();
    await expect(page).toHaveURL('');
  });
});

test.describe('Start page', () => {
  test('counter state buttons', async ({ page }) => {
    // iterating over found buttons because no other options are available(buttons have the same text and no id)
    // xpath could also be used but is considered a bad practice
    const primaryClickButton = page.getByRole('button', { name: /Click/ }).first();
    const secondaryClickButton = page.getByRole('button', { name: /Click/ }).nth(1);
    await expect(primaryClickButton).toBeVisible();
    await expect(secondaryClickButton).toBeVisible();
    await expect(primaryClickButton).toHaveClass(/MuiButton-outlinedPrimary/);
    await expect(secondaryClickButton).toHaveClass(/MuiButton-containedSecondary/);

    // test wether both buttons update the counter state correctly
    await primaryClickButton.click();
    await expect(primaryClickButton).toHaveText('Click 1');
    await expect(secondaryClickButton).toHaveText('Click 1');

    await secondaryClickButton.click();
    await expect(primaryClickButton).toHaveText('Click 2');
    await expect(secondaryClickButton).toHaveText('Click 2');
  });

  test('chuck norris api container', async ({ page }) => {
    const dataCount = page.getByText(/Data/);
    const reloadButton = page.getByTestId('reload-btn');
    await expect(reloadButton).toBeVisible();
    await expect(dataCount).toBeVisible();
    await expect(dataCount).toHaveText(/Data\s\(0\)/);
    await reloadButton.click();
    await expect(reloadButton).toHaveText(/Reload data/);
    await expect(dataCount).toHaveText(/Data\s\(1\)/);
  });
});
