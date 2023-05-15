import { useState } from 'react';

const useLiveMenuSocket = (url: string) => {
  const [socket, _] = useState<WebSocket>(
    new WebSocket(`ws://localhost:3002/?room=${url}`)
  );
  const [socketStatus, setSocketStatus] = useState<number>(3);

  socket.addEventListener('open', () => setSocketStatus(WebSocket.OPEN));
  socket.addEventListener('close', () => setSocketStatus(WebSocket.CLOSED));

  return { socket, socketStatus };
};

export default useLiveMenuSocket;
