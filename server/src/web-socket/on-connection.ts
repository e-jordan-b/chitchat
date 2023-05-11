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
import uuid4 from 'uuid4';

const transcriptionService = new TranscriptionService();
const roomService = new RoomService();

export const onConnection = async (
  socketServer: WebSocketServer,
  socketClient: WebSocket,
  request: IncomingMessage
) => {
  console.log('new connection');
  const { room: roomUrl, speaker } = parse(request.url || '', true).query;
  console.log(roomUrl, speaker);
  if (
    !roomUrl ||
    !speaker ||
    typeof roomUrl !== 'string' ||
    typeof speaker !== 'string'
  ) {
    socketClient.close();
    return;
  }

  // TODO: Get user id

  const { room, error } = await fetchRoomByUrl(roomUrl);

  if (!room || error) {
    socketClient.close();
    return;
  }

  const userId = uuid4();
  const roomId = room._id.toString();
  const roomAgenda = room.agenda;

  console.log(`${speaker} ID: ${userId}`);

  // [ START RoomService ]
  roomService.addRoom(roomId);
  roomService.addCallerToRoom(roomId, userId);

  // [ START TranscriptionService ]
  transcriptionService.addStream(roomId, userId, speaker);

  // [ START SocketClient ]
  (socketClient as SocketClient).roomId = roomId;
  (socketClient as SocketClient).userId = userId;

  console.log('SOCKET CLIENT ROOMID', (socketClient as SocketClient).roomId);

  socketClient.on('message', (data) =>
    onMessage(socketClient as SocketClient, transcriptionService, data)
  );

  // Cleanup the stream
  socketClient.on('close', () => {
    roomService.removeCallerFromRoom(roomId, userId);

    // The stream gets paused if there are less than two callers in the room
    if (roomService.shouldPauseStream(roomId)) {
      // Update the CallStatus for the FE: => status: PAUSED
      socketServer.clients.forEach((client) => {
        const socketClient = client as SocketClient;
        if (
          socketClient.readyState === WebSocket.OPEN &&
          socketClient.roomId === roomId
        ) {
          const message = JSON.stringify({ callUpdate: { status: 'PAUSED' } });
          socketClient.send(message);
        }
      });

      // Clean up the stream
      transcriptionService.cleanStream(roomId, userId);

      // TODO: Call to STOP the scheduler
      // TODO: Call to REMOVE the scheduler
    }
  });

  // LOGIC DONE FOR LIFECYCLE

  // [ STREAMING CAN START ? ]
  // console.log(
  //   roomService.shouldResumeStream(roomId),
  //   transcriptionService.resumeStream(roomId, userId)
  // );
  if (roomService.shouldResumeStream(roomId)) {
    const participants = roomService.getCallersForRoom(roomId);

    console.log(participants);

    if (participants.length === 2) {
      participants.forEach((userId) =>
        transcriptionService.resumeStream(roomId, userId)
      );

      // TODO: Call to INSTANTIATE? scheduler
      // TODO: Call to START scheduler

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
    } else {
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
  }
};
