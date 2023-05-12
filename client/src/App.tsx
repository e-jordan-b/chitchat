import React, { useRef, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Room from './components/room/room';


export default function App() {
  return (
    <BrowserRouter>
      <Route path="/" />
      <Route path="/room" Component={Room} />
    </BrowserRouter>
  );
}
