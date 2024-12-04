import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthPage } from '../../components/AuthPage';
import { useStore } from '../../store/useStore';

describe('AuthPage', () => {
  beforeEach(() => {
    useStore.setState({ users: [], currentUser: null });
  });

  it('should switch between login and registration forms', async () => {
    render(<AuthPage />);
    
    // Initially shows login form
    expect(screen.getByText('Login')).toHaveClass('text-indigo-600');
    
    // Switch to registration
    await userEvent.click(screen.getByText('Register'));
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    
    // Switch back to login
    await userEvent.click(screen.getByText('Login'));
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
  });

  it('should handle user registration', async () => {
    render(<AuthPage />);
    
    await userEvent.click(screen.getByText('Register'));
    
    await userEvent.type(screen.getByLabelText('Name'), 'Test User');
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');
    
    const registerButton = screen.getByRole('button', { name: 'Register' });
    await userEvent.click(registerButton);
    
    await waitFor(() => {
      const state = useStore.getState();
      expect(state.users).toHaveLength(1);
      expect(state.currentUser?.name).toBe('Test User');
    });
  });

  it('should show error for password mismatch', async () => {
    render(<AuthPage />);
    
    await userEvent.click(screen.getByText('Register'));
    
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'different');
    
    const registerButton = screen.getByRole('button', { name: 'Register' });
    await userEvent.click(registerButton);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});