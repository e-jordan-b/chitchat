import { WebSocketServer, WebSocket } from 'ws';
import { SocketClient } from '../models/socket-client-model';

// Create instance of WS Server
export const createRoomSocketServer = (): WebSocketServer => {
  const socketServer = new WebSocketServer({
    port: Number(process.env.PORT_SOCKET) || 3002,
  });

  socketServer.on('connection', (client: SocketClient, request) =>
    // onConnection(socketServer, client, request)
    console.log('CONNECTED')
  );

  socketServer.on('close', () => console.log('connection closed'));

  socketServer.on('error', () => console.log('error'));

  return socketServer;
};
