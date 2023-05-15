import React, { useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from './user/user-context';

import { Provider } from 'react-redux'
import store from './store';

import Room from './components/room/room';
import { useAuth } from './hooks/use-auth';
import Landing from './components/landing/landing';

import UserCallSettings from './components/UserCallSettings';
import GuestCallSettings from './components/GuestCallSettings';
import AgendaCreation from './components/AgendaCreation';
import Start from './components/Call';

export default function App() {
  const { user, setUser, loading, error, fire } = useAuth();

  console.log('USER', user);

  return (
    <Provider store={store}>
      <UserContext.Provider
        value={{ user: user, update: (user) => setUser(user) }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/call" element={<Start />} />

            <Route path="/settings" element={<UserCallSettings />} />
            <Route path="/agenda" element={<AgendaCreation />} />


            <Route path="/settings/:url" element={<GuestCallSettings />} />

            <Route path="/room/:url" element={<Room />} />

          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </Provider>
  );
}
