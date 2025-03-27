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

## Mock Testing vs. Live Testing

The tests support two modes:
1. **Mock mode**: Tests run with mock responses without requiring a live server
2. **Live mode**: Tests run against a live server

To switch between modes, change the `useMockServer` flag in each test file:
```javascript
const useMockServer = true; // Set to false for live testing
```

## Running Tests

### With Mock Server (no backend required)

To run all tests with mock responses:
```bash
cd backend/dev
npx playwright test
```

### With Live Server (Automatic Server Start)

The Playwright configuration includes a `webServer` setting that automatically starts and stops the backend server during test runs. To use this feature:

1. Set `useMockServer = false` in the test files
2. Run the tests:
```bash
cd backend/dev
npx playwright test
```

This will automatically:
- Start the backend server
- Wait for it to be available at http://localhost:5000
- Run the tests
- Shut down the server when tests complete

To run specific test suites:
```bash
# Basic API endpoints
npx playwright test tests/api-basic-endpoints.api.pw.spec.js

# Authentication endpoints
npx playwright test tests/api-auth-endpoints.api.pw.spec.js

# Assessment endpoints
npx playwright test tests/api-assessment-endpoints.api.pw.spec.js
```

To run only API tests (without browser):
```bash
npx playwright test --project=api
```

To run only browser tests (with Safari):
```bash
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
- Test data is generated with randomized values to avoid conflicts 