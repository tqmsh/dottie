# Dottie API End-to-End Tests

This directory contains Playwright end-to-end tests for the Dottie API endpoints.

## Setup

The tests are configured to use only Safari browser for UI tests as per project requirements.

## Running Tests

Make sure the backend server is running at http://localhost:5000 before executing the tests.

To run all tests:
```bash
npm test
```

To run specific test suites:
```bash
# Basic API endpoints
npm run test:basic

# Authentication endpoints
npm run test:auth

# Assessment endpoints
npm run test:assessment
```

To run only API tests (without browser):
```bash
npm run test:api
```

To run only browser tests (with Safari):
```bash
npm run test:browser
```

## Viewing Reports

After running tests, you can view the generated HTML report:
```bash
npm run report
```

## Test Files

- `api-basic-endpoints.spec.js` - Tests for `/api/hello` and `/api/db-status` endpoints
- `api-auth-endpoints.spec.js` - Tests for authentication-related endpoints
- `api-assessment-endpoints.spec.js` - Tests for assessment-related endpoints

## Notes

- These tests assume the API is running at `http://localhost:5000`
- Some tests may be skipped if prerequisites aren't met (e.g., authentication token not available)
- Test data is generated with randomized values to avoid conflicts 