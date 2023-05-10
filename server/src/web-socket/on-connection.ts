import { WebSocket, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import TranscriptionService from '../services/transcription-service';
import { IncomingMessage } from 'http';
import { onMessage } from './on-message';

import { ITranscript } from '../models/transcription-model';
import { IRoom, Room, fetchRoomByUrl } from '../models/room-model';
import { parse } from 'url';
import { addToMemory } from '../services/memory-service';
import { safelyCreateRoom } from '../services/room-service';

const transcriptionService = new TranscriptionService();

export const onConnection = async (
  socketServer: WebSocketServer,
  socketClient: WebSocket,
  request: IncomingMessage
) => {
  console.log('new connection');
  const { room: roomUrl } = parse(request.url || '', true).query;

  if (!roomUrl || typeof roomUrl !== 'string') {
    socketClient.close();
    return;
  }

  const { room, error } = await fetchRoomByUrl(roomUrl);

  if (!room || error) {
    socketClient.close();
    return;
  }

  safelyCreateRoom(room._id as string, room.urlUUID);

  // const fetchedRoom: IRoom | null = await Room.findOne({
  //   urlUUID: room,
  // }).exec();
  // if (fetchedRoom) {
  //   const roomId = fetchedRoom._id;
  //   const agenda = fetchedRoom.agenda;
  // }

  // This should not be called until both clients are ready to start the call
  const stream = transcriptionService.addStream(); // Should be done here?
  stream.pause();

  stream.on('error', (error) => console.log(error));

  stream.on('data', (data) => {
    const timestamp = new Date().getTime();
    const transcription = data.results[0].alternatives[0].transcript;

    // const transcript: ITranscript = {
    //   speaker: 'fksoasf', // TODO: Add speaker ID
    //   room,
    //   text: transcription,
    //   timestamp: timestamp,
    // };

    // addToMemory(transcript);
  });

  socketClient.on('message', (data, isBinary) => {
    console.log(isBinary);
    console.log(data);
  });

  // socketClient.on('message', (data) =>
  //   onMessage(socketServer, socketClient as SocketClient, stream, data)
  // );
};
