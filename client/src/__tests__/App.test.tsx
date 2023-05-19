import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders without errors', () => {
    render(
      // <MemoryRouter>
        <App />
      // </MemoryRouter>
    );
  });
})