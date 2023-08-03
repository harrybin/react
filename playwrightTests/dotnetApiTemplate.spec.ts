// EXAMPLE_COMPONENT
/**
 * Integration tests examples for the DotnetApiTemplate
 * using Playwright and Testcontainer
 */

/* eslint-disable prettier/prettier */
import { expect, test } from '@playwright/test';
import { AlwaysPullPolicy, DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait } from 'testcontainers';
// Configure the backend containers in docker-compose.yml
// setup docker compose environment(example below)
// every test is started in a new environment => isolated tests that are not dependent on previous state
// database cleanup for each test

test.describe('DotNetApiExample', () => {
  //setup backend for  integration testing
  let environment: StartedDockerComposeEnvironment;
  test.setTimeout(50000); // increase default timeout because slow machines may take their tim to start the containers
  test.beforeEach(async ({ page }) => {
    environment = await new DockerComposeEnvironment('playwrightTests', 'docker-compose.yml')
      .withBuild()
      .withWaitStrategy('postgres', Wait.forAll([Wait.forListeningPorts(), Wait.forHealthCheck()]))
      .withWaitStrategy('api', Wait.forAll([Wait.forListeningPorts(), Wait.forHealthCheck()]))
      .up();

    await page.goto('');
  });

  test.afterEach(async () => {
    await environment?.stop();
  });

  const inputLabel = 'Manufacturer name';
  const buttonName = 'Add new manufacturer';
  const manuChipId = 'manufacturer-chip';
  const manufacturer1 = 'manufacturer1';
  const manufacturer2 = 'manufacturer2';

  test('add manufacturer', async ({ page }) => {
    const manufacturerChips = page.getByTestId(manuChipId);
    const textField = page.getByLabel(inputLabel);
    const addManufacturerBtn = page.getByRole('button', { name: buttonName });
    await textField.click();
    await textField.fill(manufacturer1);
    await addManufacturerBtn.click();
    const manufacturer1Chip = page.getByText(manufacturer1, { exact: true }).first();
    await expect(manufacturer1Chip).toBeVisible();
    await expect(manufacturer1Chip).toHaveText(new RegExp(manufacturer1));

    await expect(textField).toHaveValue(manufacturer1);
    await textField.click();
    await textField.clear();
    await textField.fill(manufacturer2);

    // test navigation and focus
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const manufacturer2Chip = page.getByText(manufacturer2, { exact: true }).first();
    await expect(manufacturer2Chip).toBeVisible();
    await expect(manufacturer2Chip).toHaveText(new RegExp(manufacturer2));
    // test if post of the manufacturer objects worked
    await page.evaluate('location.reload();');
    await expect(manufacturerChips).toHaveCount(2);
  });

  test('manufacturer name empty', async ({ page }) => {
    const manufacturer1Chip = page.getByText(manufacturer1, { exact: true }).first();
    const manufacturer2Chip = page.getByText(manufacturer2, { exact: true }).first();
    await expect(manufacturer1Chip).toBeHidden();
    await expect(manufacturer2Chip).toBeHidden();
    const textField = page.getByLabel(inputLabel);
    await textField.click();
    await textField.clear();
    const addManufacturerBtn = page.getByRole('button', { name: buttonName });
    await addManufacturerBtn.click();
    await page.getByLabel(inputLabel).click();
    // no chip added
    expect(await page.getByTestId(manuChipId).count()).toBe(0);
    // expect snackbar error messages
    const snackbarAlert = page.getByText(/Timestamp/).first();
    await expect(snackbarAlert).toBeVisible();
  });
});
