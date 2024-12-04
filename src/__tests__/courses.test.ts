import { describe, it, expect, beforeEach } from 'vitest';
import { dbOperations } from '../db';
import { useStore } from '../store/useStore';
import type { User, Course } from '../types';

describe('Course Management', () => {
  let teacher: User;
  let student: User;
  let course: Course;

  beforeEach(async () => {
    await dbOperations.clearAll();
    useStore.setState({ users: [], courses: [], currentUser: null });
    
    const store = useStore.getState();
    
    // Create test teacher
    await store.addUser({
      name: 'Test Teacher',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher'
    });
    teacher = (await dbOperations.getAllUsers())[0];

    // Create test student
    await store.addUser({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    });
    student = (await dbOperations.getAllUsers())[1];

    // Create test course
    const courseData = {
      name: 'Test Course',
      date: '2024-03-20',
      description: 'Test Description',
      teacherId: teacher.id
    };
    await store.addCourse(courseData);
    course = (await dbOperations.getAllCourses())[0];
  });

  it('should create a new course', async () => {
    const courses = await dbOperations.getAllCourses();
    expect(courses).toHaveLength(1);
    expect(courses[0]).toMatchObject({
      name: 'Test Course',
      teacherId: teacher.id,
      description: 'Test Description'
    });
  });

  it('should allow student enrollment', async () => {
    const store = useStore.getState();
    await store.enrollStudent(course.id, student.id);

    const updatedCourse = (await dbOperations.getAllCourses())[0];
    expect(updatedCourse.enrolledStudents).toContain(student.id);
  });

  it('should prevent duplicate enrollment', async () => {
    const store = useStore.getState();
    await store.enrollStudent(course.id, student.id);

    await expect(
      store.enrollStudent(course.id, student.id)
    ).rejects.toThrow('Student already enrolled');
  });

  it('should handle invalid course enrollment', async () => {
    const store = useStore.getState();
    await expect(
      store.enrollStudent('invalid-id', student.id)
    ).rejects.toThrow('Course not found');
  });
});