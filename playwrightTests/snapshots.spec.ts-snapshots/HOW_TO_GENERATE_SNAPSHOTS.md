# How to Generate Playwright Snapshots

This directory will contain the actual PNG snapshot files once generated. The snapshots are not included in the initial commit because they need to be generated in the local environment where the tests will run.

## Expected Files After Generation

When you run `npx playwright test snapshots.spec.ts --update-snapshots`, the following files will be created in this directory:

```
playwrightTests/snapshots.spec.ts-snapshots/
├── home-page-chromium-linux.png          # Full home page screenshot  
├── test-page-chromium-linux.png          # Full test page screenshot
├── home-content-chromium-linux.png       # Home page content area
├── test-content-chromium-linux.png       # Test page content area
├── README.md                             # Existing documentation
├── SNAPSHOTS.md                          # Existing documentation  
└── HOW_TO_GENERATE_SNAPSHOTS.md         # This file
```

## How Playwright Snapshots Work

### 1. **Baseline Creation (First Run)**
```bash
npx playwright test snapshots.spec.ts --update-snapshots
```
- Creates baseline PNG images in this directory
- These become the "golden" images for comparison
- **These files should be committed to version control**

### 2. **Visual Regression Testing (Subsequent Runs)**
```bash
npx playwright test snapshots.spec.ts
```
- Takes new screenshots of the current application
- Compares them pixel-by-pixel against stored baselines
- Fails if differences exceed the threshold (0.2 configured)
- Helps catch unintended visual changes

### 3. **Updating Baselines (When UI Changes Are Intentional)**
```bash
npx playwright test snapshots.spec.ts --update-snapshots
```
- Updates baseline images when you've made intentional UI changes
- Run this when you want to accept new visuals as the new standard
- Commit updated snapshots to maintain accuracy

## File Naming Convention

Playwright automatically names snapshots using the pattern:
`{test-name}-{browser}-{platform}.png`

**From the test code:**
- `await expect(page).toHaveScreenshot('home-page.png')` → `home-page-chromium-linux.png`
- `await expect(page).toHaveScreenshot('test-page.png')` → `test-page-chromium-linux.png`
- `await expect(locator).toHaveScreenshot('home-content.png')` → `home-content-chromium-linux.png`
- `await expect(locator).toHaveScreenshot('test-content.png')` → `test-content-chromium-linux.png`

## Setup Instructions

1. **Install Playwright browsers** (one-time setup):
   ```bash
   npx playwright install chromium
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Generate initial snapshots**:
   ```bash
   npx playwright test snapshots.spec.ts --update-snapshots
   ```

4. **Commit the generated PNG files** to git:
   ```bash
   git add playwrightTests/snapshots.spec.ts-snapshots/*.png
   git commit -m "Add baseline snapshots for visual regression testing"
   ```

## What the Snapshots Validate

Each snapshot test ensures:
- ✅ No React error boundaries are displayed (`text=Stacktrace:` is hidden)
- ✅ No error messages are shown (`text=[Error]` is hidden)  
- ✅ All UI components render correctly without crashes
- ✅ Navigation elements are visible and properly styled
- ✅ Page layout and styling remain consistent across changes

The snapshots serve as a visual safety net to catch regressions that might not be caught by unit tests alone.