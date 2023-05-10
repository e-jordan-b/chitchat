import { SpeechClient } from '@google-cloud/speech';
import serviceAccount from './gcloud-service-account.json';
import Pumpify from 'pumpify';

const speechClient = new SpeechClient({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});

class TranscriptionService {
  client: SpeechClient;

  constructor() {
    this.client = new SpeechClient({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
  }

  addStream(): Pumpify {
    const stream = this.client.streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        model: 'latest_long',
      },
      interimResults: false,
    });

    return stream;
  }
}

export default TranscriptionService;
