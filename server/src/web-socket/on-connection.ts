import { WebSocket, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import TranscriptionService from '../services/transcription-service';
import { IncomingMessage } from 'http';
import { onMessage } from './on-message';
import { fetchRoomByUrl } from '../models/room-model';
import { parse } from 'url';
import RoomService from '../services/room-service';
import uuid4 from 'uuid4';

import SchedulerService from '../services/scheduler-service';

const transcriptionService = new TranscriptionService();
const roomService = new RoomService();
const schedulerService = new SchedulerService(transcriptionService);

export const onConnection = async (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
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
      schedulerService.stop(roomId);
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
      schedulerService.add(roomId, roomAgenda);
      schedulerService.start(roomId);

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
