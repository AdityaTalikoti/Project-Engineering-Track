import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import * as authApi from '../../api/auth';

// Mock the auth API module at the top of the file as required by Move 5
jest.mock('../../api/auth');

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('happy path', () => {
    // Protects against form layout changes that would hide or break inputs/buttons
    test('renders the email input, password input, and submit button', () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    // Protects against submission handler failures or sending incorrect credentials to API
    test('when valid credentials are typed and submit is clicked, the API function is called with correct values', async () => {
      authApi.loginUser.mockResolvedValue({ user: { email: 'test@example.com' } });

      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(authApi.loginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });

  describe('failure cases', () => {
    // Protects against failure feedback loops where errors from login don't render to users
    test('when the API rejects with an error, the error message text appears in the UI', async () => {
      authApi.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpass');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    // Protects against double-submissions by ensuring submit button disables during execution
    test('the submit button shows a loading state while the API call is in progress', async () => {
      let resolveLogin;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = () => resolve({ user: { email: 'test@example.com' } });
      });
      authApi.loginUser.mockReturnValueOnce(loginPromise);

      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      // Assert the disabled state immediately after clicking
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Loading...');

      // Resolve the login promise to finish state updates and avoid act warnings
      resolveLogin();
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('edge cases', () => {
    // Protects against API spam or crashes when users trigger submit with blank inputs
    test('clicking submit with empty fields does NOT call the API function', async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      expect(authApi.loginUser).not.toHaveBeenCalled();
    });
  });
});
