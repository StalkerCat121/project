import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseList } from '../../components/CourseList';
import { useStore } from '../../store/useStore';

describe('CourseList', () => {
  const testCourse = {
    id: '1',
    name: 'Test Course',
    date: '2024-03-20',
    description: 'Test Description',
    teacherId: '1',
    enrolledStudents: []
  };

  const testTeacher = {
    id: '1',
    name: 'Test Teacher',
    email: 'teacher@test.com',
    password: 'password123',
    role: 'teacher' as const
  };

  beforeEach(() => {
    useStore.setState({
      courses: [testCourse],
      users: [testTeacher],
      currentUser: null
    });
  });

  it('should display course information', () => {
    render(<CourseList />);
    
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Teacher: Test Teacher')).toBeInTheDocument();
  });

  it('should handle student enrollment', async () => {
    const student = {
      id: '2',
      name: 'Test Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student' as const
    };

    useStore.setState({
      currentUser: student,
      users: [testTeacher, student]
    });

    render(<CourseList />);
    
    const enrollButton = screen.getByRole('button', { name: 'Enroll' });
    await userEvent.click(enrollButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Enrolled' })).toBeDisabled();
    });
  });

  it('should show enrolled students', async () => {
    const student = {
      id: '2',
      name: 'Test Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student' as const
    };

    useStore.setState({
      courses: [{
        ...testCourse,
        enrolledStudents: [student.id]
      }],
      users: [testTeacher, student]
    });

    render(<CourseList />);
    
    expect(screen.getByText('Test Student')).toBeInTheDocument();
    expect(screen.getByText('student@test.com')).toBeInTheDocument();
  });
});