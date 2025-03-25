import { describe, it, expect } from 'vitest';

// You can tag individual tests
describe('Individual test tagging', () => {
  it('should run with dev tag', { tags: ['dev'] }, () => {
    expect(true).toBe(true);
  });
  
  it('should run with prod tag', { tags: ['prod'] }, () => {
    expect(true).toBe(true);
  });
  
  it('should run with both dev and prod tags', { tags: ['dev', 'prod'] }, () => {
    expect(true).toBe(true);
  });
  
  // This test has no tags and will run in all test runs
  it('should run in all test runs', () => {
    expect(true).toBe(true);
  });
});

// You can also tag entire describe blocks
describe('Tagged describe block', { tags: ['dev'] }, () => {
  // All tests in this describe block will inherit the 'dev' tag
  it('inherits dev tag from describe', () => {
    expect(true).toBe(true);
  });
  
  it('also inherits dev tag from describe', () => {
    expect(true).toBe(true);
  });
  
  // You can add additional tags to individual tests
  it('has both dev and custom tags', { tags: ['custom'] }, () => {
    expect(true).toBe(true);
  });
});

// Example of nested describes with tags
describe('Parent describe', { tags: ['parent'] }, () => {
  describe('Child describe with dev tag', { tags: ['dev'] }, () => {
    it('has both parent and dev tags', () => {
      expect(true).toBe(true);
    });
  });
  
  describe('Child describe without additional tags', () => {
    it('inherits only parent tag', () => {
      expect(true).toBe(true);
    });
    
    it('can add dev tag individually', { tags: ['dev'] }, () => {
      expect(true).toBe(true);
    });
  });
}); 