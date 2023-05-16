import { WebSocketServer, WebSocket } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { onConnection } from './on-connection';

// Create instance of WS Server
export const createSignallingSocketServer = (): WebSocketServer => {
  const socketServer = new WebSocketServer({
    port: Number(process.env.SIGNALING_SOCKET) || 3003,
  });

  socketServer.on('connection', (client: SocketClient, request) =>
    onConnection(socketServer, client, request)
  );

  socketServer.on('close', () => console.log('connection closed'));

  socketServer.on('error', (error) => console.log('error signalign socket', error));

  return socketServer;
};
