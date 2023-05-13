import { WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import uuid4 from 'uuid4';
import RTCStagingService from '../services/rtcstaging-service';

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

  // TODO: Setup onMessage

  // Communicate client its role
  socketClient.send(JSON.stringify({ rtcUpdate: { role: clientRole } }));
};
