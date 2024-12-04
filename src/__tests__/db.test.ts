import { describe, it, expect, beforeEach } from 'vitest';
import { dbOperations } from '../db';

describe('Database Operations', () => {
  beforeEach(async () => {
    await dbOperations.clearAll();
  });

  describe('User Operations', () => {
    it('should add and retrieve a user', async () => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student' as const
      };

      await dbOperations.addUser(user);
      const users = await dbOperations.getAllUsers();
      
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual(user);
    });

    it('should clear all users', async () => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student' as const
      };

      await dbOperations.addUser(user);
      await dbOperations.clearAll();
      const users = await dbOperations.getAllUsers();
      
      expect(users).toHaveLength(0);
    });
  });

  describe('Course Operations', () => {
    it('should add and retrieve a course', async () => {
      const course = {
        id: '1',
        name: 'React Basics',
        date: '2024-03-20',
        description: 'Learn React fundamentals',
        teacherId: '123',
        enrolledStudents: []
      };

      await dbOperations.addCourse(course);
      const courses = await dbOperations.getAllCourses();
      
      expect(courses).toHaveLength(1);
      expect(courses[0]).toEqual(course);
    });

    it('should update a course', async () => {
      const course = {
        id: '1',
        name: 'React Basics',
        date: '2024-03-20',
        description: 'Learn React fundamentals',
        teacherId: '123',
        enrolledStudents: []
      };

      await dbOperations.addCourse(course);
      
      const updatedCourse = {
        ...course,
        enrolledStudents: ['student1']
      };
      
      await dbOperations.updateCourse(updatedCourse);
      const courses = await dbOperations.getAllCourses();
      
      expect(courses[0].enrolledStudents).toEqual(['student1']);
    });
  });
});