# End-to-End Tests for the API Message Functionality

These tests verify the API connection functionality on the test page in development mode.

## Directory Structure

All screenshots are now saved in a more organized structure:

```
test_screenshots/
├── development/
│   └── test_page/
│       ├── api-connection/
│       │   ├── mock/
│       │   │   ├── initial-state.png
│       │   │   ├── section.png
│       │   │   ├── connection-error.png
│       │   │   └── connection-success.png
│       │   └── real/
│       │       ├── initial-state.png
│       │       ├── section.png
│       │       └── connection-result.png
│       ├── database-connection/
│       │   ├── mock/
│       │   └── real/
│       └── both-connections/
│           ├── mock/
│           └── real/
└── production/
    └── test_page/
        └── [similar structure]
```

## Running the Tests

To run all API message connection tests:

```
cd dottie-app
npx playwright test src/components/test_page/__tests__/GetApiMessage/e2e/development
```

To run only mock tests:

```
cd dottie-app
npx playwright test src/components/test_page/__tests__/GetApiMessage/e2e/development/api-connection.mock.dev.spec.ts
```

To run only real connection tests:

```
cd dottie-app
npx playwright test src/components/test_page/__tests__/GetApiMessage/e2e/development/api-connection.real.dev.spec.ts
```

## Notes

- Tests are using the Safari browser only, as configured in playwright.config.ts
- Screenshots are automatically saved in both the new organized structure and the legacy location (for backward compatibility)
- The screenshot helper functions are defined in `src/components/test_page/__tests__/screenshot-helpers.ts`


