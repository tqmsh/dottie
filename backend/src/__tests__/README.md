# Backend Tests

## Setup Requirements

Before running the backend tests, you must set the TEST_MODE environment variable:

```powershell
$env:TEST_MODE="true"
```

This environment variable is required for the tests to run properly in development mode.

## Running Tests

To run the tests, use the following command:

```powershell
npm test
```

To run specific test files or test cases, use:

```powershell
npm test -- "TestName"
# or
npm test -- "TestName/TestCase"
```

## Test Structure

Tests are organized by feature and module. Each test file follows the naming convention `*.test.ts`. 