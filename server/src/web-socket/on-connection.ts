import { WebSocket, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import { CustomWebSocket } from '../models/socket-client-model';
import TranscriptionService from '../services/transcription-service';
import { IncomingMessage } from 'http';
import { onMessage } from './on-message';
import { setSchedulerInMemoryByUrl } from '../services/scheduler-service';
import { ITranscript } from '../models/transcription-model';
import { IRoom, Room, fetchRoomByUrl } from '../models/room-model';
import { parse } from 'url';
import { addToMemory } from '../services/memory-service';
import RoomService from '../services/room-service';
import uuid4 from 'uuid4';

import SummaryScheduler from '../scheduler/scheduler';

const transcriptionService = new TranscriptionService();
const roomService = new RoomService();

export const onConnection = async (
  socketServer: WebSocketServer,
  socketClient: CustomWebSocket,
  request: IncomingMessage
) => {
  console.log('new connection');
  const { room: roomUrl, speaker } = parse(request.url || '', true).query;

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

  socketClient.schedulerId = roomUrl;

  const userId = uuid4();
  const roomId = room._id.toString();
  const roomAgenda = room.agenda;

  // [ START RoomService ]
  roomService.addRoom(roomId);
  roomService.addCallerToRoom(roomId, userId);

  // [ START TranscriptionService ]
  const stream = transcriptionService.addStream(roomId, userId, speaker);

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
    roomService.removeCallerFromRoom(roomId, userId);
    if (roomService.shouldPauseStream(roomId)) {
      // stream.removeAllListeners();
      // stream.destroy();
      // TODO: Call to STOP the scheduler
      // TODO: Call to REMOVE the scheduler
      // TODO: Tell FE to Stop MediaRecording
      // TODO: Stop the mediarecording for all clients
    }
  });

  // LOGIC DONE FOR LIFECYCLE

  // [ STREAMING CAN START ? ]
  // console.log(
  //   roomService.shouldResumeStream(roomId),
  //   transcriptionService.resumeStream(roomId, userId)
  // );
  if (
    roomService.shouldResumeStream(roomId) &&
    transcriptionService.resumeStream(roomId, userId)
  ) {
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
    //   onMessage(socketServer, socketClient as SocketClient, recognizeStream, data)
    // );

};
