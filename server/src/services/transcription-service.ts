import { SpeechClient } from '@google-cloud/speech';
import serviceAccount from './gcloud-service-account.json';
import Pumpify from 'pumpify';
import { ITranscript } from '../models/transcription-model';

class TranscriptionService {
  private client: SpeechClient;
  private streams: Map<string, Pumpify>;

  constructor() {
    this.client = new SpeechClient({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
    this.streams = new Map();
  }

  private mergeIds = (roomId: string, userId: string): string => {
    return `${roomId}*${userId}`;
  };

  /**
   * Adds a new stream to the speech client.
   * Can attach listeners to the stream
   * @returns
   */
  addStream(roomId: string, userId: string, speaker: string): boolean {
    const streamId = this.mergeIds(roomId, userId);
    if (this.streams.has(streamId)) return false;

    const stream = this.client.streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        model: 'latest_long',
      },
      interimResults: false,
    });

    stream.pause();

    // [ START Add Listeners ]
    stream.on('error', (error) => console.log(error));
    stream.on('data', (data) => {
      // Add transcript
      const timestamp = new Date().getTime();
      const text = data.results[0].alternatives[0].transcript;
      const transcription: ITranscript = { speaker, text, timestamp };

      // TODO: Add transcription to memory
    });

    this.streams.set(streamId, stream);

    return true;
  }

  /**
   * Returns the specific stream for a room and user combo.
   * @param roomId
   * @param userId
   * @returns
   */
  getStream(roomId: string, userId: string): Pumpify | undefined {
    const streamId = this.mergeIds(roomId, userId);
    return this.streams.get(streamId);
  }

  resumeStream(roomId: string, userId: string): boolean {
    const streamId = this.mergeIds(roomId, userId);
    if (this.streams.has(streamId)) {
      this.streams.get(streamId)!.resume();
      return true;
    } else {
      return false;
    }
  }

  pauseStream(roomId: string, userId: string): boolean {
    const streamId = this.mergeIds(roomId, userId);
    if (this.streams.has(streamId)) {
      this.streams.get(streamId)!.pause();
      return true;
    } else {
      return false;
    }
  }
}

export default TranscriptionService;
