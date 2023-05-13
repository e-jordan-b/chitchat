import { RawData, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import RTCStagingService from '../services/rtcstaging-service';

export const socketOnMessage = (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  data: RawData,
  rtcStagingService: RTCStagingService
) => {
  const rtcStaging = rtcStagingService.getStaging(socketClient.roomId);
  const clientRole = rtcStaging?.removeClient(socketClient.userId);

  socketServer.clients.forEach((client) => {
    if (
      (client as SocketClient).roomId === socketClient.roomId &&
      (client as SocketClient).userId !== socketClient.userId
    ) {
      client.send(data.toString());
    }
  });
};
