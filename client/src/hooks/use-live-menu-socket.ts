import { useState } from 'react';

const useLiveMenuSocket = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [socketStatus, setSocketStatus] = useState<number>(3);

  const connect = (url: string) => {
    const ws = new WebSocket(`ws://localhost:3004/?room=${url}`);
    ws.addEventListener('open', () => setSocketStatus(WebSocket.OPEN));
    ws.addEventListener('close', () => setSocketStatus(WebSocket.CLOSED));
    setSocket(ws);
  };

  return { socket, socketStatus, connect };
};

export default useLiveMenuSocket;
