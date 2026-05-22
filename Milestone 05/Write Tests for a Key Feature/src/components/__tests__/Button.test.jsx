import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  describe('happy path', () => {
    // Protects against regressions where the button doesn't display its label or uses incorrect accessible naming
    test('renders the correct label text from the label prop', () => {
      render(<Button label="Submit" />);
      const buttonElement = screen.getByRole('button', { name: /submit/i });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Submit');
    });

    // Protects against actions not firing click events or firing multiple times unexpectedly
    test('calls the onClick handler exactly once when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button label="Submit" onClick={handleClick} />);
      const buttonElement = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('failure cases', () => {
    // Protects against loading states accidentally allowing users to submit actions multiple times
    test('does not trigger onClick when button is in loading state', async () => {
      const handleClick = jest.fn();
      render(<Button label="Submit" onClick={handleClick} loading={true} />);
      const buttonElement = screen.getByRole('button', { name: /loading.../i });
      expect(buttonElement).toBeDisabled();
      await userEvent.click(buttonElement);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    // Protects against disabled button styling or behavior permitting clicks to propagate
    test('is disabled and onClick is NOT called when disabled={true} prop is passed', async () => {
      const handleClick = jest.fn();
      render(<Button label="Submit" onClick={handleClick} disabled={true} />);
      const buttonElement = screen.getByRole('button', { name: /submit/i });
      expect(buttonElement).toBeDisabled();
      await userEvent.click(buttonElement);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
