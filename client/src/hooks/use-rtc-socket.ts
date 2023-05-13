import { useEffect, useMemo, useState } from 'react';

const useRTCSocket = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [status, setStatus] = useState<number>(3);
  const [error, setError] = useState<string>();

  const connect = (url: string, onMessage: (ev: MessageEvent) => void) => {
    const baseUrl = `ws://localhost:3003/?room=${url}`;
    const ws = new WebSocket(baseUrl);

    ws.addEventListener('open', () => setStatus(WebSocket.OPEN));
    ws.addEventListener('close', () => setStatus(WebSocket.CLOSED));

    ws.addEventListener('message', onMessage);
    setSocket(ws);
  };

  return { socket, socketStatus: status, connectSocket: connect };
};

export default useRTCSocket;
