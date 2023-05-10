import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  schedulerId: string | null;
}

export interface SocketClient extends CustomWebSocket {
  roomId: string;
}
