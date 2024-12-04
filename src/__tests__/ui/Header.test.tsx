import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../components/Header';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../store/useTheme';

describe('Header', () => {
  it('should display user information when logged in', () => {
    useStore.setState({
      currentUser: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      }
    });

    render(<Header />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('(student)')).toBeInTheDocument();
  });

  it('should handle logout', async () => {
    useStore.setState({
      currentUser: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      }
    });

    render(<Header />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);
    
    expect(useStore.getState().currentUser).toBeNull();
  });

  it('should toggle theme', async () => {
    useTheme.setState({ isDark: false });
    render(<Header />);
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    await userEvent.click(themeToggle);
    
    expect(useTheme.getState().isDark).toBe(true);
  });
});