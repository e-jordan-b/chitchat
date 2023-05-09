import { RawData, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import Pumpify from 'pumpify';

export const onMessage = (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  recognize: Pumpify,
  data: RawData
) => {
  recognize.write(data);
};
