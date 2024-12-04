import { describe, it, expect, beforeEach } from 'vitest';
import { dbOperations } from '../db';
import { useStore } from '../store/useStore';

describe('Concurrent Operations', () => {
  beforeEach(async () => {
    await dbOperations.clearAll();
    useStore.setState({ users: [], courses: [], currentUser: null });
  });

  it('should handle concurrent user registrations', async () => {
    const store = useStore.getState();
    const users = [
      {
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123',
        role: 'student' as const
      },
      {
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123',
        role: 'teacher' as const
      }
    ];

    await Promise.all(users.map(user => store.addUser(user)));
    const storedUsers = await dbOperations.getAllUsers();
    
    expect(storedUsers).toHaveLength(2);
    expect(storedUsers.map(u => u.email)).toEqual(
      expect.arrayContaining(users.map(u => u.email))
    );
  });

  it('should handle concurrent course enrollments', async () => {
    const store = useStore.getState();
    
    // Create teacher
    await store.addUser({
      name: 'Teacher',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher'
    });
    const teacher = (await dbOperations.getAllUsers())[0];

    // Create course
    await store.addCourse({
      name: 'Test Course',
      date: '2024-03-20',
      description: 'Test Description',
      teacherId: teacher.id
    });
    const course = (await dbOperations.getAllCourses())[0];

    // Create and enroll multiple students concurrently
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

    await Promise.all(
      students.map(student => store.enrollStudent(course.id, student.id))
    );

    const updatedCourse = (await dbOperations.getAllCourses())[0];
    expect(updatedCourse.enrolledStudents).toHaveLength(2);
    expect(updatedCourse.enrolledStudents).toEqual(
      expect.arrayContaining(students.map(s => s.id))
    );
  });
});