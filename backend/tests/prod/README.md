# Production Testing Guide

This directory contains tests specifically designed for production environment testing, including database connectivity and API validation with live services.

## Testing Methods

We use two different testing approaches in this project:

1. **Vitest** - For structured test suites with assertions and mocking capabilities
2. **Direct Node.js Scripts** - For quick database connectivity tests and raw output

## Running Vitest Tests

Vitest tests are structured with assertions and are the primary testing framework:

```bash
# Run all production tests
npm run test:prod

# Run a specific test file
npx vitest run tests/prod/your-test-file.test.js
```

## Running Node.js Script Tests

Some tests are direct Node.js scripts that can be executed directly:

```bash
# To test against production Azure SQL database
$env:NODE_ENV="production"; node --experimental-vm-modules tests/e2e/prod/test-db.js

# To test against development SQLite database
$env:NODE_ENV="development"; node --experimental-vm-modules tests/e2e/prod/test-db.js
```

## Available Script Tests

- **test-db.js** - Tests database connectivity and lists available tables
- **test-db-output.js** - Similar to test-db.js but writes results to a file

## Output Files

Some tests generate output files:
- `db-tables-output.txt` - Contains database table information

## When to Use Each Approach

- **Use Vitest** when you need:
  - Structured test assertions
  - Mocking capabilities
  - Integration with CI/CD pipelines
  - Test reporting

- **Use Node.js Scripts** when you need:
  - Quick ad-hoc testing
  - Immediate feedback on connectivity issues
  - Raw output for debugging
  - Testing without assertion overhead

## Important Notes

1. Azure SQL connection may time out if:
   - Your IP is not whitelisted in Azure SQL firewall
   - Connection details in .env are incorrect
   - Network connectivity issues exist

2. Set proper environment variables:
   - `$env:NODE_ENV="production"` for Azure SQL
   - `$env:NODE_ENV="development"` for SQLite 