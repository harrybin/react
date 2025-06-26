# Example Snapshot Files

The following files will be generated when running the snapshot tests:

```
playwrightTests/snapshots.spec.ts-snapshots/
├── home-page-chromium-linux.png          # Full home page screenshot
├── test-page-chromium-linux.png          # Full test page screenshot  
├── home-content-chromium-linux.png       # Home page content area
├── test-content-chromium-linux.png       # Test page content area
└── README.md                             # This documentation
```

To generate actual snapshots:

```bash
# Install Playwright browsers (one time setup)
npx playwright install

# Generate/update snapshots
npx playwright test snapshots.spec.ts --update-snapshots

# Run snapshot comparison tests
npx playwright test snapshots.spec.ts
```

The snapshots will capture the React application's visual state and ensure no errors are displayed to users.