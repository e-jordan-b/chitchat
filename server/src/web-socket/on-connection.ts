import { WebSocket, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import TranscriptionService from '../services/transcription-service';
import { IncomingMessage } from 'http';
import { onMessage } from './on-message';

import { ITranscript } from '../models/transcription-model';
import { IRoom, Room } from '../models/room-model';
import { parse } from 'url';
import { addToMemory } from '../services/memory-service';

const transcriptionService = new TranscriptionService();

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

  const fetchedRoom: IRoom | null = await Room.findOne({
    urlUUID: room,
  }).exec();
  if (fetchedRoom) {
    const roomId = fetchedRoom._id;
    const agenda = fetchedRoom.agenda;
  }

  // This should not be called until both clients are ready to start the call
  const stream = transcriptionService.addStream();

  stream.on('error', (error) => console.log(error));

  stream.on('data', (data) => {
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
    onMessage(socketServer, socketClient as SocketClient, stream, data)
  );
};
