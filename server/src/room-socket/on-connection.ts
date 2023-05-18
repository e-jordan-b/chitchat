import { WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import uuid4 from 'uuid4';

import { socketOnMessage } from './socket-on-message';

export const onConnection = (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  request: IncomingMessage
) => {
  const { room: roomUrl } = parse(request.url || '', true).query;
  const userId = uuid4();

  console.log('ROOM', roomUrl);
  console.log('CLIENTS', socketServer.clients.size);

  if (!roomUrl || typeof roomUrl !== 'string') {
    socketClient.close();
    return;
  }

  socketClient.roomId = roomUrl;
  socketClient.userId = userId;

  console.log('RoomSocket/ClientID', socketClient.userId);

  socketClient.on('message', (data) =>
    socketOnMessage(socketServer, socketClient, data)
  );
};
