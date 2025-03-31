# API Integration Tests

This directory contains integration tests for the API endpoints to verify that all components work together correctly in a complete user journey flow, with special focus on authentication token persistence between operations.

## Structure

The test suite is organized as follows:

- `integration.test.js` - The main test file that runs all tests in sequence
- `runners/` - Directory containing modules with utility functions for different API areas:
  - `apiClient.js` - API client with automatic token management
  - `auth.js` - Authentication operations
  - `user.js` - User profile operations  
  - `assessment.js` - Assessment operations

## Running Tests

Make sure your API server is running on the default port (3000) before running the tests.

To run the integration tests:

```bash
# From the dottie-app directory:
npm test -- "api/__tests__/unit/integration/integration.test.js"
```

## Key Features

1. **Authentication Token Persistence**: The test suite uses a centralized API client with interceptors to automatically include the authentication token in all requests. This ensures that you don't need to pass the token around in your tests.

2. **Clean Test Structure**: Tests follow a clear, sequential flow that mimics real user behavior.

3. **Detailed Logging**: Each operation logs details to help with debugging.

4. **Validation**: Each step includes proper validation to ensure the operations were successful.

## Customizing Tests

You can modify these tests for your specific needs:

- Update API endpoints in the runner files
- Adjust test timeouts in `integration.test.js` if needed
- Change the base URL in `beforeAll` hook for different environments

## Notes

- The tests are designed to run in sequence (not in parallel)
- Tests clean up after themselves by deleting created records
- Tests verify that the token remains valid throughout the entire flow 