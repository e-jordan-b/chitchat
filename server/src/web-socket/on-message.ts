import { RawData, WebSocketServer } from 'ws';
import { SocketClient } from '../models/socket-client-model';
import Pumpify from 'pumpify';
import TranscriptionService from '../services/transcription-service';

export const onMessage = (
  socketServer: WebSocketServer,
  socketClient: SocketClient,
  transcriptionService: TranscriptionService,
  data: RawData
) => {
  // recognize.write(data);
};
