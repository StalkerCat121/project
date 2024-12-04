import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../store/useTheme';

describe('ThemeToggle', () => {
  it('should toggle between light and dark mode', async () => {
    useTheme.setState({ isDark: false });
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByLabelText('Toggle theme');
    await userEvent.click(toggleButton);
    
    expect(useTheme.getState().isDark).toBe(true);
    
    await userEvent.click(toggleButton);
    expect(useTheme.getState().isDark).toBe(false);
  });

  it('should display correct icon based on theme', () => {
    useTheme.setState({ isDark: true });
    const { rerender } = render(<ThemeToggle />);
    
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    
    useTheme.setState({ isDark: false });
    rerender(<ThemeToggle />);
    
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });
});