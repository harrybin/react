# Playwright Visual Snapshot Files

This directory contains the baseline PNG screenshots used for visual regression testing.

## Current Snapshot Files

### Home Page (`/`)
- **`home-page-chromium-linux.png`** (1280x720) - Full page screenshot of the home page
- **`home-content-chromium-linux.png`** (800x400) - Focused screenshot of main content area

### Test Page (`/test`)  
- **`test-page-chromium-linux.png`** (1280x720) - Full page screenshot of the test page
- **`test-content-chromium-linux.png`** (800x400) - Focused screenshot of main content area

## What These Snapshots Show

### Home Page Features
- React Template App title
- Interactive buttons (Click counters, Testroute navigation)
- User input fields (Firstname, Lastname)
- Chuck Norris joke component
- Material-UI styling and layout

### Test Page Features
- Test Warning button (orange)
- Test Exception buttons (red - for error testing)
- Navigation back to Home
- Material-UI Paper container layout

## Snapshot Validation

The tests verify that:
- ✅ No React error boundaries are visible (`text=Stacktrace:`)
- ✅ No error messages are displayed (`text=[Error]`)
- ✅ All network requests complete before capturing
- ✅ Pages render consistently across test runs

## How to Update Snapshots

When making intentional UI changes, update the baseline snapshots:

```bash
# Generate new baseline screenshots
npx playwright test snapshots.spec.ts --update-snapshots

# Run tests to verify new snapshots pass
npx playwright test snapshots.spec.ts
```

## Technical Details

- **Browser**: Chromium (Desktop Chrome device emulation)
- **Platform**: Linux
- **Naming**: `{test-name}-{browser}-{platform}.png`
- **Threshold**: 0.2 (20% pixel difference tolerance)
- **Capture Method**: `page.waitForLoadState('networkidle')` ensures stable captures

These snapshots provide visual regression protection for the React application UI.