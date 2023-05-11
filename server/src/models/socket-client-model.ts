import { WebSocket } from 'ws';

export interface SocketClient extends WebSocket {
  roomUrl: string;
  roomId: string; // ObjectID
  userId: string;
}
