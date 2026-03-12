/* @vitest-environment jsdom */
import '../../../frontend/src/setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import PrivateRoute from '../../../frontend/src/components/PrivateRoute';

const mockUseAuth = vi.fn();

vi.mock('../../../frontend/src/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

function renderRoute() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div>Dashboard privé</div>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<div>Page de login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PrivateRoute', () => {
  test('shows loading state while auth is loading', () => {
    mockUseAuth.mockReturnValue({ token: null, loading: true });
    renderRoute();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('renders protected content when token exists', () => {
    mockUseAuth.mockReturnValue({ token: 'token-123', loading: false });
    renderRoute();
    expect(screen.getByText('Dashboard privé')).toBeInTheDocument();
  });

  test('redirects to login when token is missing', () => {
    mockUseAuth.mockReturnValue({ token: null, loading: false });
    renderRoute();
    expect(screen.getByText('Page de login')).toBeInTheDocument();
  });
});