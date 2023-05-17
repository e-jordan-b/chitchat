import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  test('opens the AuthModal when "Login" button is clicked', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId('button-login'));
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    // expect(screen.getByTestId('button-login')).toBeInTheDocument();
  });

  test('displays the "Start a meeting" button', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    expect(screen.getByText('Start a meeting')).toBeInTheDocument();
  });

//   test('opens the CreateRoom component when "Start a meeting" button is clicked', () => {
//     render(
//       <BrowserRouter>
//         <Landing />
//       </BrowserRouter>
//     );
//     fireEvent.click(screen.getByText('Start a meeting'));
//     expect(screen.getByTestId('create-room')).toBeInTheDocument();
//   });
 })