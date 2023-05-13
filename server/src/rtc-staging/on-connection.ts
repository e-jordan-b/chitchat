import { WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import uuid4 from 'uuid4';
import RTCStagingService from '../services/rtcstaging-service';
import { socketOnClose } from './socket-on-close';
import { socketOnMessage } from './socket-on-message';

const rtcStagingService = new RTCStagingService();

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

  // Try and create a new room
  const rtcStaging = rtcStagingService.safelyAddStaging(roomUrl);
  const clientRole = rtcStaging.addClient(userId);

  if (clientRole === -1) {
    console.log(
      'RTCStaging/onConnection error: Tried adding a client to a full room!'
    );
    socketClient.close();
    return;
  }

  // Removes the client from either the HOST or GUEST roles.
  socketClient.on('close', () =>
    socketOnClose(socketClient, rtcStagingService)
  );

  // TODO: Setup onMessage
  socketClient.on('message', (data) =>
    socketOnMessage(socketServer, socketClient, data, rtcStagingService)
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
