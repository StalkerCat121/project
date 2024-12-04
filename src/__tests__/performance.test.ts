import { describe, it, expect, beforeEach } from 'vitest';
import { dbOperations } from '../db';
import { useStore } from '../store/useStore';
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  beforeEach(async () => {
    await dbOperations.clearAll();
    useStore.setState({ users: [], courses: [], currentUser: null });
  });

  it('should handle bulk course creation efficiently', async () => {
    const store = useStore.getState();
    const teacher = {
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher' as const
    };
    await store.addUser(teacher);
    const users = await dbOperations.getAllUsers();
    const teacherId = users[0].id;

    const coursesToCreate = 100;
    const start = performance.now();

    const coursePromises = Array.from({ length: coursesToCreate }).map((_, index) => 
      store.addCourse({
        name: `Course ${index}`,
        date: '2024-03-20',
        description: `Description for course ${index}`,
        teacherId
      })
    );

    await Promise.all(coursePromises);
    const end = performance.now();
    const timePerCourse = (end - start) / coursesToCreate;

    expect(timePerCourse).toBeLessThan(50); // Each course should take less than 50ms to create
    const courses = await dbOperations.getAllCourses();
    expect(courses).toHaveLength(coursesToCreate);
  });

  it('should handle concurrent student enrollments efficiently', async () => {
    const store = useStore.getState();
    
    // Create a teacher and a course
    await store.addUser({
      name: 'Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });
    const teacher = (await dbOperations.getAllUsers())[0];

    await store.addCourse({
      name: 'Test Course',
      date: '2024-03-20',
      description: 'Test Description',
      teacherId: teacher.id
    });
    const course = (await dbOperations.getAllCourses())[0];

    // Create multiple students
    const studentCount = 50;
    const studentPromises = Array.from({ length: studentCount }).map((_, index) =>
      store.addUser({
        name: `Student ${index}`,
        email: `student${index}@test.com`,
        password: 'password123',
        role: 'student'
      })
    );

    const students = await Promise.all(studentPromises);
    const start = performance.now();

    // Enroll all students concurrently
    const enrollmentPromises = students.map(student =>
      store.enrollStudent(course.id, student.id)
    );

    await Promise.all(enrollmentPromises);
    const end = performance.now();
    const timePerEnrollment = (end - start) / studentCount;

    expect(timePerEnrollment).toBeLessThan(30); // Each enrollment should take less than 30ms
    const updatedCourse = (await dbOperations.getAllCourses())[0];
    expect(updatedCourse.enrolledStudents).toHaveLength(studentCount);
  });

  it('should perform user authentication quickly', async () => {
    const store = useStore.getState();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };

    await store.addUser(userData);

    const start = performance.now();
    await store.login(userData.email, userData.password);
    const end = performance.now();
    const loginTime = end - start;

    expect(loginTime).toBeLessThan(100); // Login should take less than 100ms
    expect(store.currentUser).toBeTruthy();
  });

  it('should handle database operations efficiently', async () => {
    const start = performance.now();
    
    // Perform a series of database operations
    const operations = 50;
    const operationPromises = Array.from({ length: operations }).map((_, index) =>
      dbOperations.addUser({
        id: crypto.randomUUID(),
        name: `User ${index}`,
        email: `user${index}@test.com`,
        password: 'password123',
        role: 'student'
      })
    );

    await Promise.all(operationPromises);
    const end = performance.now();
    const timePerOperation = (end - start) / operations;

    expect(timePerOperation).toBeLessThan(20); // Each DB operation should take less than 20ms
    const users = await dbOperations.getAllUsers();
    expect(users).toHaveLength(operations);
  });

  it('should maintain performance with large datasets', async () => {
    const store = useStore.getState();
    
    // Create a large number of users and courses
    const userCount = 100;
    const courseCount = 50;

    // Create users
    const userPromises = Array.from({ length: userCount }).map((_, index) =>
      store.addUser({
        name: `User ${index}`,
        email: `user${index}@test.com`,
        password: 'password123',
        role: index % 5 === 0 ? 'teacher' : 'student'
      })
    );

    await Promise.all(userPromises);
    const users = await dbOperations.getAllUsers();
    const teachers = users.filter(u => u.role === 'teacher');

    // Create courses
    const coursePromises = Array.from({ length: courseCount }).map((_, index) =>
      store.addCourse({
        name: `Course ${index}`,
        date: '2024-03-20',
        description: `Description for course ${index}`,
        teacherId: teachers[index % teachers.length].id
      })
    );

    await Promise.all(coursePromises);

    // Measure time to load all data
    const start = performance.now();
    await store.initialize();
    const end = performance.now();
    const loadTime = end - start;

    expect(loadTime).toBeLessThan(500); // Loading should take less than 500ms
    expect(store.users).toHaveLength(userCount);
    expect(store.courses).toHaveLength(courseCount);
  });
});