import React, { useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from './user/user-context';

import Room from './components/room/room';
import { useAuth } from './hooks/use-auth';
import Landing from './components/landing/landing';

export default function App() {
  const { user, setUser, loading, error, fire } = useAuth();

  console.log('USER', user);

  return (
    <UserContext.Provider
      value={{ user: user, update: (user) => setUser(user) }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
