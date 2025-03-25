import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import User from '../../models/User.js';
import db from '../../db/index.js';
import { createTables, dropTables } from '../../db/migrations/initialSchema.js';

describe('User Model', { tags: ['authentication', 'unit', 'success'] }, () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password_hash: 'hashedpassword123',
    age: 16
  };

  let userId;

  // Set up the database before all tests
  beforeAll(async () => {
    await createTables(db);
  });

  // Clean up after all tests
  afterAll(async () => {
    await dropTables(db);
    await db.destroy();
  });

  // Clean up users before each test
  beforeEach(async () => {
    // Delete all users
    await db('users').delete();
  });

  it('should create a new user', async () => {
    const user = await User.create(testUser);
    userId = user.id;

    expect(user).toHaveProperty('id');
    expect(user.username).toBe(testUser.username);
    expect(user.email).toBe(testUser.email);
    expect(user.age).toBe(testUser.age);
  });

  it('should find a user by ID', async () => {
    const createdUser = await User.create(testUser);
    const user = await User.findById(createdUser.id);

    expect(user).toHaveProperty('id', createdUser.id);
    expect(user.username).toBe(testUser.username);
  });

  it('should find a user by email', async () => {
    await User.create(testUser);
    const user = await User.findByEmail(testUser.email);

    expect(user).toHaveProperty('email', testUser.email);
  });

  it('should update a user', async () => {
    const createdUser = await User.create(testUser);
    const updatedUser = await User.update(createdUser.id, {
      username: 'updatedusername'
    });

    expect(updatedUser.username).toBe('updatedusername');
    expect(updatedUser.email).toBe(testUser.email);
  });

  it('should delete a user', async () => {
    const createdUser = await User.create(testUser);
    const deleted = await User.delete(createdUser.id);
    const user = await User.findById(createdUser.id);

    expect(deleted).toBe(true);
    expect(user).toBeNull();
  });

  it('should get all users', async () => {
    await User.create(testUser);
    await User.create({
      ...testUser,
      username: 'anotheruser',
      email: 'another@example.com'
    });

    const users = await User.getAll();
    expect(users).toHaveLength(2);
  });
}); 