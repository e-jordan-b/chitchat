import { WebSocketServer } from 'ws';
import { onConnection } from './on-connection';

// Create instance of WS Server
export const createSocketServer = (): WebSocketServer => {
  const socketServer = new WebSocketServer({
    port: Number(process.env.PORT_SOCKET) || 3002,
  });

  socketServer.on('connection', (client, request) =>
    onConnection(socketServer, client, request)
  );

  socketServer.on('close', () => console.log('connection closed'));

  socketServer.on('error', () => console.log('error'));

  return socketServer;
};
