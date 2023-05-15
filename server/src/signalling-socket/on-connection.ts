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

  if (!roomUrl || typeof roomUrl !== 'string') {
    socketClient.close();
    return;
  }

  // VALIDATE ROOM + ADD ROOM ID AS ID

  socketClient.roomId = roomUrl;
  socketClient.userId = userId;

  // TODO: Setup onMessage
  socketClient.on('message', (data) =>
    socketOnMessage(socketServer, socketClient, data)
  );

  console.log('USER', userId, 'ROOM', roomUrl);

  // Communicate client its role
  // socketClient.send(JSON.stringify({ rtcUpdate: { role: clientRole } }));
  socketServer.clients.forEach((socketClient) => {
    if (
      (socketClient as SocketClient).roomId === roomUrl &&
      (socketClient as SocketClient).userId !== userId
    ) {
      socketClient.send(JSON.stringify({ type: 'PeerHasJoined' }));
    }
  });
};
