import { describe, it, expect, beforeEach } from 'vitest';
import { dbOperations } from '../db';
import { useStore } from '../store/useStore';
import type { User, Course } from '../types';

describe('API Integration Tests', () => {
  beforeEach(async () => {
    await dbOperations.clearAll();
    useStore.setState({ users: [], courses: [], currentUser: null });
  });

  describe('User Management', () => {
    it('should create and authenticate a user', async () => {
      const store = useStore.getState();
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student' as const
      };

      // Register user
      await store.addUser(userData);
      const users = await dbOperations.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject(userData);

      // Login user
      await store.login(userData.email, userData.password);
      expect(store.currentUser).toMatchObject(userData);
    });

    it('should handle concurrent user registrations', async () => {
      const store = useStore.getState();
      const userData1 = {
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123',
        role: 'student' as const
      };
      const userData2 = {
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123',
        role: 'teacher' as const
      };

      // Register users concurrently
      await Promise.all([
        store.addUser(userData1),
        store.addUser(userData2)
      ]);

      const users = await dbOperations.getAllUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe('Course Management', () => {
    let teacher: User;
    let student: User;
    let course: Course;

    beforeEach(async () => {
      const store = useStore.getState();
      
      // Create a teacher
      await store.addUser({
        name: 'Test Teacher',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'teacher'
      });
      teacher = (await dbOperations.getAllUsers())[0];

      // Create a student
      await store.addUser({
        name: 'Test Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student'
      });
      student = (await dbOperations.getAllUsers())[1];

      // Create a course
      const courseData = {
        name: 'Test Course',
        date: '2024-03-20',
        description: 'Test Description',
        teacherId: teacher.id
      };
      await store.addCourse(courseData);
      course = (await dbOperations.getAllCourses())[0];
    });

    it('should create and retrieve courses', async () => {
      const courses = await dbOperations.getAllCourses();
      expect(courses).toHaveLength(1);
      expect(courses[0]).toMatchObject({
        name: 'Test Course',
        teacherId: teacher.id
      });
    });

    it('should handle student enrollment', async () => {
      const store = useStore.getState();
      await store.enrollStudent(course.id, student.id);

      const updatedCourse = (await dbOperations.getAllCourses())[0];
      expect(updatedCourse.enrolledStudents).toContain(student.id);
    });

    it('should prevent duplicate enrollments', async () => {
      const store = useStore.getState();
      await store.enrollStudent(course.id, student.id);

      await expect(
        store.enrollStudent(course.id, student.id)
      ).rejects.toThrow('Student already enrolled');
    });

    it('should handle concurrent enrollments', async () => {
      const store = useStore.getState();
      
      // Create multiple students
      const students = await Promise.all([
        store.addUser({
          name: 'Student 1',
          email: 'student1@example.com',
          password: 'password123',
          role: 'student'
        }),
        store.addUser({
          name: 'Student 2',
          email: 'student2@example.com',
          password: 'password123',
          role: 'student'
        })
      ]);

      // Enroll students concurrently
      await Promise.all(
        students.map(student => 
          store.enrollStudent(course.id, student.id)
        )
      );

      const updatedCourse = (await dbOperations.getAllCourses())[0];
      expect(updatedCourse.enrolledStudents).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid course enrollment', async () => {
      const store = useStore.getState();
      await expect(
        store.enrollStudent('invalid-id', 'student-id')
      ).rejects.toThrow('Course not found');
    });

    it('should handle database errors gracefully', async () => {
      // Simulate database error by clearing the database
      await dbOperations.clearAll();
      
      const store = useStore.getState();
      await expect(
        store.login('test@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });
  });
});