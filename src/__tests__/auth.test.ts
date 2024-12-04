import { describe, it, expect, beforeEach } from 'vitest';
import { dbOperations } from '../db';
import { useStore } from '../store/useStore';

describe('Authentication', () => {
  beforeEach(async () => {
    await dbOperations.clearAll();
    useStore.setState({ users: [], courses: [], currentUser: null });
  });

  it('should register a new user', async () => {
    const store = useStore.getState();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };

    await store.addUser(userData);
    const users = await dbOperations.getAllUsers();
    
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject(userData);
  });

  it('should login with correct credentials', async () => {
    const store = useStore.getState();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };

    await store.addUser(userData);
    await store.login(userData.email, userData.password);
    
    expect(store.currentUser).toMatchObject(userData);
  });

  it('should prevent duplicate email registration', async () => {
    const store = useStore.getState();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };

    await store.addUser(userData);
    
    await expect(
      store.addUser({
        ...userData,
        name: 'Another User'
      })
    ).rejects.toThrow('Email already registered');
  });

  it('should reject invalid login credentials', async () => {
    const store = useStore.getState();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };

    await store.addUser(userData);
    
    await expect(
      store.login('test@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password');
  });
});