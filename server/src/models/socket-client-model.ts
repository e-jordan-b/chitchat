import { WebSocket } from 'ws';

export interface SocketClient extends WebSocket {
  roomId: string;
}
