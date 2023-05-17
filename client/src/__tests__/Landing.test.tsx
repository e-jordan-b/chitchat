import React from 'react';
import { render, screen, fireEvent, getByTestId } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Landing from '../components/landing/landing';

describe('Landing', () => {
  test('renders without errors', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
  });
  test('displays the "Login" button', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('expect button login to be in the document', () => {
    const onClick = jest.fn()
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByTestId('button-login')).toBeInTheDocument()
  });

  test('displays the "Start a meeting" button', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    expect(screen.getByText('Start a meeting')).toBeInTheDocument();
  });
 })