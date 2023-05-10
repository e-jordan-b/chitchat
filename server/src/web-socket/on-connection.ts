import { WebSocket, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import TranscriptionService from '../services/transcription-service';
import { IncomingMessage } from 'http';
import { onMessage } from './on-message';

import { ITranscript } from '../models/transcription-model';
import { IRoom, Room, fetchRoomByUrl } from '../models/room-model';
import { parse } from 'url';
import { addToMemory } from '../services/memory-service';
import RoomService from '../services/room-service';

const transcriptionService = new TranscriptionService();
const roomService = new RoomService();

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

  // TODO: Get user id

  const { room, error } = await fetchRoomByUrl(roomUrl);

  if (!room || error) {
    socketClient.close();
    return;
  }

  const roomId = room._id.toString();
  const roomAgenda = room.agenda;

  // [ START RoomService ]
  roomService.addRoom(roomId);
  roomService.addCallerToRoom(roomId, 'userid');

  // [ START TranscriptionService ]
  const stream = transcriptionService.addStream(roomId, 'userId');

  // [ START SocketClient ]
  (socketClient as SocketClient).roomId = roomId;
  (socketClient as SocketClient).userId = 'mao' as string;

  console.log('SOCKET CLIENT ROOMID', (socketClient as SocketClient).roomId);

  socketClient.on('message', (data, isBinary) => {
    console.log(isBinary);
    console.log(data);
    // Check state of the room
    // getRoom.callStatus === STARTED;
    // if (callHasStarted) {
    //   stream.write(data);
    // }
  });

  // Cleanup the stream
  socketClient.on('close', () => {
    // TODO: Add real user id
    roomService.removeCallerFromRoom(roomId, 'userid');
    if (roomService.shouldPauseStream(roomId)) {
      // stream.removeAllListeners();
      // stream.destroy();

      // TODO: Call to stop the scheduler
    }
  });

  // LOGIC DONE FOR LIFECYCLE

  // [ STREAMING CAN START ? ]
  console.log(
    roomService.shouldResumeStream(roomId),
    transcriptionService.resumeStream(roomId, 'userid')
  );
  if (
    roomService.shouldResumeStream(roomId) &&
    transcriptionService.resumeStream(roomId, 'userid')
  ) {
    // TODO: Call to scheduler

    socketServer.clients.forEach((client) => {
      const socketClient = client as SocketClient;
      if (
        socketClient.readyState === WebSocket.OPEN &&
        socketClient.roomId === roomId
      ) {
        const message = JSON.stringify({ callUpdate: { status: 'STARTED' } });
        socketClient.send(message);
      }
    });
  } else if (roomService.shouldResumeStream(roomId)) {
    console.log('IN ERROR');
    socketServer.clients.forEach((client) => {
      const socketClient = client as SocketClient;
      if (
        socketClient.readyState === WebSocket.OPEN &&
        socketClient.roomId === roomId
      ) {
        const message = JSON.stringify({ callUpdate: { status: 'ERROR' } });
        socketClient.send(message);
      }
    });
  }

  // socketClient.on('message', (data) =>
  //   onMessage(socketServer, socketClient as SocketClient, stream, data)
  // );
};
