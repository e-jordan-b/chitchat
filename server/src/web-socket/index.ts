import { WebSocketServer, WebSocket } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { onConnection } from './on-connection';

// Create instance of WS Server
export const createStreamSocketServer = (): WebSocketServer => {
  const socketServer = new WebSocketServer({
    port: Number(process.env.STREAM_SOCKET) || 3002,
  });

  socketServer.on('connection', (client: SocketClient, request) =>
    onConnection(socketServer, client, request)
  );

  socketServer.on('close', () => console.log('connection closed'));

  socketServer.on('error', () => console.log('error'));

  return socketServer;
};
