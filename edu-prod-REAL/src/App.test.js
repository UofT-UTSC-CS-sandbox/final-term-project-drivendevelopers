import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders login button', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});
