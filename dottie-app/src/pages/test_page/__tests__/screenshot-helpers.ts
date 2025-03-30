import path from 'path';

/**
 * Helper function to generate screenshot paths according to the new directory structure
 * @param environment 'development' | 'production' - The environment the test is running in
 * @param component 'api-connection' | 'database-connection' | 'both-connections' - The component being tested
 * @param testMode 'mock' | 'real' - Whether the test is using mocked or real data
 * @param filename The filename for the screenshot (without path)
 * @returns The full path to save the screenshot
 */
export function getScreenshotPath(
  environment: 'development' | 'production',
  component: 'api-connection' | 'database-connection' | 'both-connections',
  testMode: 'mock' | 'real',
  filename: string
): string {
  return path.join(
    process.cwd(),
    'test_screenshots',
    environment,
    'test_page',
    component,
    testMode,
    filename
  );
}

/**
 * Helper function to provide backward compatibility during migration
 * @param filename The filename to save in the old directory structure
 * @returns The full path in the old directory structure
 */
export function getLegacyScreenshotPath(filename: string): string {
  return path.join(process.cwd(), 'test_screenshots', 'test_page', filename);
} 