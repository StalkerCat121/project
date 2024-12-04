import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseForm } from '../../components/CourseForm';
import { useStore } from '../../store/useStore';

describe('CourseForm', () => {
  beforeEach(() => {
    useStore.setState({
      users: [{
        id: '1',
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher'
      }],
      currentUser: {
        id: '1',
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher'
      },
      courses: []
    });
  });

  it('should create a new course', async () => {
    render(<CourseForm />);
    
    await userEvent.type(screen.getByLabelText('Course Name'), 'Test Course');
    await userEvent.type(screen.getByLabelText('Description'), 'Test Description');
    await userEvent.type(screen.getByLabelText('Date'), '2024-03-20');
    
    const submitButton = screen.getByRole('button', { name: 'Create Course' });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      const state = useStore.getState();
      expect(state.courses).toHaveLength(1);
      expect(state.courses[0].name).toBe('Test Course');
    });
  });

  it('should not render form for non-teacher users', () => {
    useStore.setState({
      currentUser: {
        id: '2',
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
      }
    });

    render(<CourseForm />);
    expect(screen.getByText('Only teachers can create courses')).toBeInTheDocument();
  });
});