/* @vitest-environment jsdom */
import '../../../frontend/src/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../../../frontend/src/components/Login';

const mockLogin = vi.fn();

vi.mock('../../../frontend/src/contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin })
}));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Login', () => {
  test('submits credentials and navigates on success', async () => {
    mockLogin.mockResolvedValue({ success: true });
    const user = userEvent.setup();

    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'password');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password');
      expect(screen.getByText('Dashboard page')).toBeInTheDocument();
    });
  });

  test('shows API error when login fails', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Identifiants invalides' });
    const user = userEvent.setup();

    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'bad');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
  });
});