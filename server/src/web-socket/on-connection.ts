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

//Instantiate our services
const transcriptionService = new TranscriptionService();
const roomService = new RoomService();
const schedulerService = new SchedulerService(transcriptionService);

export const onConnection = async (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  request: IncomingMessage
) => {
  //Handle Connection
  console.log('Stream connection');

  //Extract room url and speaker name from request url
  const { room: roomUrl, speaker } = parse(request.url || '', true).query;

  console.log(roomUrl, speaker);

  //Validate
  if (
    !roomUrl ||
    !speaker ||
    typeof roomUrl !== 'string' ||
    typeof speaker !== 'string'
  ) {
    socketClient.close();
    return;
  }

  // Fetch room details based on room url
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
  //add this caller to the room
  roomService.addCallerToRoom(roomId, userId, speaker); // Also speaker name

  // [ START TranscriptionService ]
  //adds the stream and initiates the transcription
  transcriptionService.addStream(roomId, userId, speaker);

  // [ START SocketClient ]
  // Assign the roomId and userId to the SocketClient
  (socketClient as SocketClient).roomId = roomId;
  (socketClient as SocketClient).userId = userId;

  // Handle incoming messages from the socket client
  socketClient.on('message', (data) =>
    onMessage(socketClient as SocketClient, transcriptionService, data)
  );

  // Cleanup the stream
  socketClient.on('close', () => {
    //if socket closes we remove the caller that disconnected from room service
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

          // Clean streams for other participants
          transcriptionService.cleanStream(
            socketClient.roomId,
            socketClient.userId
          );
        }
      });

      transcriptionService.cleanStream(roomId, userId);

      //stops the scheduler
      schedulerService.stop(roomId);
    }
  });

  // LOGIC DONE FOR LIFECYCLE

  // [ STREAMING CAN START ? ]
  // console.log(
  //   roomService.shouldResumeStream(roomId),
  //   transcriptionService.resumeStream(roomId, userId)
  // );
  //Check if the room has more than 1 participant? --> then resume the stream and transcription
  if (roomService.shouldResumeStream(roomId)) {
    const participants = roomService.getCallersForRoom(roomId);

    console.log('RESUME STREAM');

    console.log(participants);

    if (participants.length === 2) {
      participants.forEach((participant) => {
        const didResumeStream = transcriptionService.resumeStream(
          roomId,
          participant.id
        );

        // Creates a new stream if could not resume
        if (!didResumeStream) {
          transcriptionService.addStream(
            roomId,
            participant.id,
            participant.speaker
          );

          transcriptionService.resumeStream(roomId, participant.id);
        }
      });

      //Scheduler is only instantiated and started here on purpose
      //The stream is automatically paused upon creation and only here
      //when call has more than 1 participant, do we need to transcribe and summarise
      schedulerService.add(roomId, roomAgenda);
      schedulerService.start(roomId);

      //Inform FE that stream is on and audio should be recorded and sent
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
      //error handling
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
