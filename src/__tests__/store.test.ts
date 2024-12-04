import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('Store', () => {
  beforeEach(() => {
    useStore.setState({ users: [], courses: [], currentUser: null });
  });

  it('should add a user with password', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student' as const
    };
    await useStore.getState().addUser(user);
    
    const users = useStore.getState().users;
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject(user);
    expect(users[0].id).toBeDefined();
  });

  it('should login a user with correct credentials', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student' as const
    };
    await useStore.getState().addUser(user);
    
    await useStore.getState().login('john@example.com', 'password123');
    const currentUser = useStore.getState().currentUser;
    expect(currentUser).toMatchObject(user);
  });

  it('should reject login with incorrect password', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student' as const
    };
    await useStore.getState().addUser(user);
    
    await expect(
      useStore.getState().login('john@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password');
  });

  it('should prevent duplicate email registration', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student' as const
    };
    await useStore.getState().addUser(user);
    
    await expect(
      useStore.getState().addUser({
        ...user,
        name: 'Another John'
      })
    ).rejects.toThrow('Email already registered');
  });

  // Previous tests remain the same...
});