import { WebSocketServer, WebSocket } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { onConnection } from './on-connection';

// Create instance of WS Server
export const createRoomSocketServer = (): WebSocketServer => {
  const socketServer = new WebSocketServer({
    port: Number(process.env.PORT_SOCKET) || 3004,
  });

  socketServer.on('connection', (socketClient: SocketClient, request) =>
    onConnection(socketServer, socketClient, request)
  );

  socketServer.on('close', () => console.log('connection closed'));

  socketServer.on('error', () => console.log('error'));

  return socketServer;
};
