import { RawData, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';

export const socketOnMessage = (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  data: RawData
) => {
  console.log('DATA', data.toString());

  socketServer.clients.forEach((client) => {
    if (
      (client as SocketClient).roomId === socketClient.roomId &&
      (client as SocketClient).userId !== socketClient.userId
    ) {
      const message = JSON.parse(data.toString()) as {
        type: string;
        payload: any;
      };

      console.log(message);

      if (message.type === 'Chat') {
        const payload = message.payload as {
          timestamp: number;
          speaker: string;
          message: string;
        };

        client.send(
          JSON.stringify({
            type: message.type,
            payload: { ...payload, speakerId: (client as SocketClient).userId },
          })
        );
      } else {
        client.send(data.toString());
      }
    }
  });
};
