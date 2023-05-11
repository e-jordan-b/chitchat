import { RawData } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import TranscriptionService from '../services/transcription-service';

export const onMessage = (
  socketClient: SocketClient,
  transcriptionService: TranscriptionService,
  data: RawData
) => {
  const stream = transcriptionService.getStream(
    socketClient.roomId,
    socketClient.userId
  );

  if (stream && !stream.isPaused()) {
    stream?.write(data);
  }
};
