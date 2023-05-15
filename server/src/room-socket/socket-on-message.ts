import { RawData, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';

export const socketOnMessage = (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  data: RawData
) => {
  console.log("HELLo")
  socketServer.clients.forEach((client) => {
    if (
      (client as SocketClient).roomId === socketClient.roomId &&
      (client as SocketClient).userId !== socketClient.userId
    ) {
      client.send(data.toString());
    }
  });
};
