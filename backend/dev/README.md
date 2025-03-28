# Dottie API End-to-End Tests

This directory contains Playwright end-to-end tests for the Dottie API endpoints.

## Setup

The tests are configured to use only Safari browser for UI tests as per project requirements.

## File Naming Convention

To avoid conflicts between Playwright and Vitest, we use the following naming convention:
- Playwright API tests: `*.api.pw.spec.js`
- Playwright UI tests: `*.ui.pw.spec.js`
- Vitest tests (in other directories): `*.test.js`

This separation ensures that Playwright doesn't try to run Vitest tests and vice versa.

## Automatic Server Management

These tests run against the actual backend server. The Playwright configuration includes a `webServer` setting that automatically:

- Starts the backend server before tests run
- Waits for it to be available at http://localhost:5000
- Runs the tests
- Shuts down the server when tests complete

## Running Tests

From the `backend/dev` directory, run:

```bash
# Run all tests
npx playwright test

# Run specific test suites
npx playwright test tests/api-basic-endpoints.api.pw.spec.js
npx playwright test tests/api-auth-endpoints.api.pw.spec.js
npx playwright test tests/api-assessment-endpoints.api.pw.spec.js

# Run only API tests (without browser)
npx playwright test --project=api

# Run only browser tests (with Safari)
npx playwright test --project=browser
```

## Viewing Reports

After running tests, you can view the generated HTML report:
```bash
npx playwright show-report
```

## Test Files

- `api-basic-endpoints.api.pw.spec.js` - Tests for `/api/hello` and `/api/db-status` endpoints
- `api-auth-endpoints.api.pw.spec.js` - Tests for authentication-related endpoints
- `api-assessment-endpoints.api.pw.spec.js` - Tests for assessment-related endpoints

## Notes

- The `webServer` feature automatically manages the backend server for live testing
- Some tests may be skipped if prerequisites aren't met (e.g., authentication token not available)
- Test user data includes timestamps to avoid conflicts with existing data 