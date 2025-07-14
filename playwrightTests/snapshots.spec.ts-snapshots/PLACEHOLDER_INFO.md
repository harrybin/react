# Placeholder Snapshot Files

⚠️ **Important**: The PNG files in this directory are currently **placeholder files**, not actual screenshots.

## Current Status

The following PNG files are minimal placeholder images:
- `home-page-chromium-linux.png`
- `test-page-chromium-linux.png`
- `home-content-chromium-linux.png`
- `test-content-chromium-linux.png`

## How to Generate Real Snapshots

To replace these placeholders with actual screenshots, run the following commands:

### 1. Install Dependencies
```bash
npm install
npx playwright install chromium --with-deps
```

### 2. Build the Application
```bash
npm run build
```

### 3. Generate Snapshots
```bash
npx playwright test snapshots.spec.ts --update-snapshots
```

This will:
- Start the preview server automatically
- Navigate to both home (`/`) and test (`/test`) pages
- Capture full page and content area screenshots
- Replace the placeholder files with real visual snapshots

### 4. Verify Snapshots
```bash
npx playwright test snapshots.spec.ts
```

## What the Real Snapshots Will Contain

- **home-page-chromium-linux.png**: Full page screenshot of the React app home page
- **test-page-chromium-linux.png**: Full page screenshot of the test page with test buttons
- **home-content-chromium-linux.png**: Focused screenshot of the main content area on home
- **test-content-chromium-linux.png**: Focused screenshot of the test interface elements

Each snapshot validates that:
- No React error boundaries are visible
- No error messages are displayed
- All UI components render correctly
- Navigation elements are properly styled

## CI/CD Integration

Once real snapshots are generated and committed:
- GitHub Actions will automatically run visual regression tests
- Any UI changes will be caught by comparing against these baseline images
- Failed tests will upload artifacts showing visual differences

## Troubleshooting

If snapshot generation fails:
1. Ensure the application builds successfully with `npm run build`
2. Check that port 4173 is available for the preview server
3. Verify Playwright browsers are installed with `npx playwright install --help`
4. Run tests with `--ui` flag for interactive debugging: `npx playwright test snapshots.spec.ts --ui`