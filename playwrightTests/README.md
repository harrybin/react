# Snapshot Tests

This directory contains Playwright snapshot tests that capture visual screenshots of the application pages.

## Overview

The snapshot tests (`snapshots.spec.ts`) validate that:
- Both the home page (`/`) and test page (`/test`) render correctly
- No React error boundaries are displayed
- No error messages like "[Error]" or "Stacktrace:" are visible
- The application loads successfully

## Running Tests

### Prerequisites
Install Playwright browsers:
```bash
npx playwright install
```

### Running Snapshot Tests
```bash
# Run all Playwright tests
npx playwright test

# Run only snapshot tests
npx playwright test snapshots.spec.ts

# Update snapshots (when UI changes are expected)
npx playwright test snapshots.spec.ts --update-snapshots

# Run with UI mode for debugging
npx playwright test snapshots.spec.ts --ui
```

### CI/CD

The tests run automatically on all pull requests via GitHub Actions (`.github/workflows/playwright.yml`).

## Test Structure

- **Full page snapshots**: Captures entire pages for visual regression testing
- **Content area snapshots**: Focuses on main content areas
- **Error validation**: Ensures no error states are visible before taking snapshots
- **Network idle**: Waits for all network requests to complete before capturing

## Files Generated

- Baseline images: `test-results/**/snapshots.spec.ts-snapshots/`
- Test reports: `playwrightTests/test-reports/` 
- Test results: `test-results/` (excluded from git)

## Error Prevention

The tests specifically check for React error boundary content:
- No "Stacktrace:" text visible
- No "[Error]" prefixed messages
- Pages load without throwing unhandled errors