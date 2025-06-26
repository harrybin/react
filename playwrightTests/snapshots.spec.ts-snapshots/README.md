# Visual Snapshots

This directory contains the Playwright visual snapshots for the React application. The snapshots are automatically generated when running:

```bash
npx playwright test snapshots.spec.ts --update-snapshots
```

## Generated Snapshots

The following snapshots are created by the test suite:

### 1. `home-page-chromium-linux.png` 
- **Full page screenshot** of the home page (`/`)
- Captures the entire React application landing page
- Validates that no error boundaries are visible
- Ensures the "Testroute" button and navigation elements are properly rendered

### 2. `test-page-chromium-linux.png`
- **Full page screenshot** of the test page (`/test`)
- Shows the testing interface with various test buttons
- Validates error-free rendering of the test environment
- Includes navigation back to home

### 3. `home-content-chromium-linux.png`
- **Focused content area** screenshot of the home page
- Captures just the main content area without browser chrome
- Better for detecting content-specific visual regressions

### 4. `test-content-chromium-linux.png`
- **Focused content area** screenshot of the test page
- Shows the test buttons and interface elements
- Validates proper styling and layout of test components

## What the snapshots validate

Each snapshot test ensures:
- ✅ No React error boundaries are displayed (`text=Stacktrace:` is hidden)
- ✅ No error messages are shown (`text=[Error]` is hidden)  
- ✅ All UI components render correctly
- ✅ Navigation elements are visible and functional
- ✅ Page layout and styling is consistent

## CI/CD Integration

These snapshots are automatically:
- Generated during local development when tests are run with `--update-snapshots`
- Compared against in CI to catch visual regressions
- Updated when UI changes are intentionally made
- Used to prevent deployment of broken UI states

## File Naming Convention

Playwright automatically names snapshot files as:
`{test-name}-{browser}-{platform}.png`

For example: `home-page-chromium-linux.png`