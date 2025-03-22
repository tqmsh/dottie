# End-to-End (E2E) Tests for Test Page

These tests verify the functionality of the test page that demonstrates essential development environment API connections.

## Test Structure

The tests are built using Playwright with a focus on Safari, as specified in the requirements. Tests verify:

1. The page displays the correct environment heading
2. The API test button is present and visible
3. The SQLite test button is present and visible

## Screenshots

Test results are documented with screenshots stored in the `test_screenshots/test_page` folder, which is protected by the `.gitignore` file to prevent committing these screenshots to the repository.

## Running the Tests

To run the tests:

```bash
npx playwright test
```

For debugging the tests:

```bash
npx playwright test --debug
```

To view the HTML report after running the tests:

```bash
npx playwright show-report
```

## Configuration

- Tests are configured to use only Safari browser as per requirements
- Screenshots are captured on test completion
- The tests are designed to be resilient and reliable in the CI environment