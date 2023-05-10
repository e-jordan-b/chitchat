import { WebSocket, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { IncomingMessage } from 'http';
import { onMessage } from './on-message';
import { SpeechClient } from '@google-cloud/speech';

import serviceAccount from './gcloud-service-account.json';
import { ITranscript } from '../models/transcription-model';
import { IRoom, Room } from '../models/room-model';
import { parse } from 'url';
import { addToMemory, getFromMemoryByRoom } from '../services/memory-service';
import { start } from 'repl';

const speechClient = new SpeechClient({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});

export const onConnection = async (
  socketServer: WebSocketServer,
  socketClient: WebSocket,
  request: IncomingMessage
) => {
  const { room } = parse(request.url || '', true).query;

  if (!room || typeof room !== 'string') {
    socketClient.close();
    return;
  }

  const fetchedRoom:IRoom | null = await Room.findOne({urlUUID: room}).exec();
  if (fetchedRoom) {
    const roomId = fetchedRoom._id;
    const agenda = fetchedRoom.agenda;
  }

  const recognizeStream = speechClient
  .streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        model: 'latest_long',
      },
      interimResults: false,
    })
    .on('error', (error) => console.log(error))
    .on('data', (data) => {
      const timestamp = new Date().getTime();
      const transcription = data.results[0].alternatives[0].transcript;

      const transcript: ITranscript = {
        speaker: 'fksoasf', // TODO: Add speaker ID
        room,
        text: transcription,
        timestamp: timestamp,
      };

      addToMemory(transcript);
    });

    socketClient.on('message', (data) =>
      onMessage(socketServer, socketClient as SocketClient, recognizeStream, data)
    );

};
