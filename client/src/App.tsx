import React, { useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Room from './components/room/room';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
