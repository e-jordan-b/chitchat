import { useState } from 'react';

const useMediaSocket = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [error, setError] = useState<string>();

  const connect = (
    url: string,
    speaker: string,
    cb: (ev: MessageEvent) => {}
  ) => {
    const baseUrl = `ws://localhost:3002/?room=${url}&speaker=${speaker}`;
    const ws = new WebSocket(baseUrl);

    ws.addEventListener('message', cb);

    setSocket(socket);
  };

  return { socket, connectSocket: connect };
};

export default useMediaSocket;
