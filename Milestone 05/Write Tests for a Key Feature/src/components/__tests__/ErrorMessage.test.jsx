import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  describe('happy path', () => {
    // Protects against regressions where the error message is not rendered to the user
    test('renders the message prop text in the component', () => {
      render(<ErrorMessage message="An error occurred" />);
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    // Protects against retry buttons failing to appear or call their callback when clicked
    test('renders a "Try again" button when the onRetry prop is provided and calls onRetry when clicked', async () => {
      const handleRetry = jest.fn();
      render(<ErrorMessage message="An error occurred" onRetry={handleRetry} />);
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
      await userEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('failure cases', () => {
    // Protects against the component failing or crashing when message is an empty string
    test('safely handles empty or missing message string without crashing', () => {
      const { container } = render(<ErrorMessage message="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    // Protects against retry options showing up when no retry handler is available to handle the click
    test('does NOT render a retry button when onRetry prop is not provided', () => {
      render(<ErrorMessage message="An error occurred" />);
      const retryButton = screen.queryByRole('button', { name: /try again/i });
      expect(retryButton).not.toBeInTheDocument();
    });
  });
});
