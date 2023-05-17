import { SpeechClient } from '@google-cloud/speech';
import Pumpify from 'pumpify';
import TranscriptionService from '../../services/transcription-service';

jest.mock('@google-cloud/speech', () => {
  const mockStream = {
    on: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    removeAllListeners: jest.fn(),
    destroy: jest.fn()
  };

  const mockSpeechClient = {
    streamingRecognize: jest.fn().mockImplementation(() => mockStream),
  };

  return {
    SpeechClient: jest.fn().mockImplementation(() => mockSpeechClient),
  };
});

describe('TranscriptionService', () => {
  let transcriptionService: TranscriptionService;
  const speechClientMock = SpeechClient as jest.MockedClass<typeof SpeechClient>;
  let roomId = '123';
  let userId = '14233';
  let speaker = 'Adrian';
  const transcript = {
    speaker, // Speaker name
    text: 'OpenAI tokenization is cool',
    timestamp: 10103
  };

  beforeEach(() => {
    jest.clearAllMocks();
    transcriptionService = new TranscriptionService();
    jest.spyOn(transcriptionService as any, 'mergeIds').mockReturnValueOnce(`${roomId}*${userId}`);
    jest.spyOn(transcriptionService, 'saveTranscript');
  });

  describe('mergeIds', () => {
    it('should merge room and user IDs correctly', () => {
      const mergedId = transcriptionService['mergeIds'](roomId, userId);

      expect(mergedId).toBe(`${roomId}*${userId}`);
      expect(transcriptionService['mergeIds']).toHaveBeenCalledWith(roomId, userId);
    });
  });

  describe('addStream', () => {
    it('should not add a stream if it already exists and returns false', () => {
      transcriptionService.addStream(roomId, userId, speaker);
      const isStreamAdded = transcriptionService.addStream(roomId, userId, speaker);

      expect(isStreamAdded).toBe(false);
    });

    it('should add a new stream and set up listeners', () => {
      const result = transcriptionService.addStream(roomId, userId, speaker);

      // Assertions
      expect(result).toBe(true);
      expect(transcriptionService['mergeIds']).toHaveBeenCalledWith(roomId, userId);
      expect(SpeechClient).toHaveBeenCalled();

      // As the mock has already been called I can access the streamingRecognize
      const streamingRecognizeMock: jest.Mock = speechClientMock.mock.results[0].value.streamingRecognize;
      const streamPauseMock: jest.Mock = streamingRecognizeMock.mock.results[0].value.pause;
      const streamOnMock: jest.Mock = streamingRecognizeMock.mock.results[0].value.on;
  
      expect(streamingRecognizeMock).toHaveBeenCalled();
      expect(streamingRecognizeMock).toHaveBeenCalledWith({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
          model: 'latest_long',
        },
        interimResults: false,
      });
      expect(streamPauseMock).toHaveBeenCalledTimes(1);
      expect(streamOnMock).toHaveBeenCalledTimes(2); // Assuming there are two event listeners
      expect(transcriptionService.saveTranscript).toHaveBeenCalledTimes(0); // Assuming no data event is emitted
    });
  });

  describe('getStream', () => {
    it('should return the specific stream for a room and user combo', () => {
      transcriptionService.addStream(roomId, userId, speaker);
      const stream = transcriptionService.getStream(roomId, userId);

      expect(stream).toBeDefined();
      expect(transcriptionService['mergeIds']).toHaveBeenCalledWith(roomId, userId);
    });

    it('should return undefined if the stream does not exist', () => {
      const stream = transcriptionService.getStream(roomId, userId);

      expect(stream).toBeUndefined();
    });
  });

  describe('resumeStream', () => {
    it('should resume the stream and return true', () => {
      transcriptionService.addStream(roomId, userId, speaker);
      const isStreamResumed = transcriptionService.resumeStream(roomId, userId);

      // As the mock has already been called I can access the streamingRecognize
      const streamingRecognizeMock: jest.Mock = speechClientMock.mock.results[0].value.streamingRecognize;
      const streamResumeMock: jest.Mock = streamingRecognizeMock.mock.results[0].value.resume;

      expect(isStreamResumed).toBe(true);
      expect(streamResumeMock).toHaveBeenCalled();
    });

    it('should return false if the stream does not exist', () => {
      const isStreamResumed = transcriptionService.resumeStream(roomId, userId);

      expect(isStreamResumed).toBe(false);
    });
  });

  describe('pauseStream', () => {
    it('should pause the stream and return true', () => {
      transcriptionService.addStream(roomId, userId, speaker);
      const isStreamPaused = transcriptionService.pauseStream(roomId, userId);

      // As the mock has already been called I can access the streamingRecognize
      const streamingRecognizeMock: jest.Mock = speechClientMock.mock.results[0].value.streamingRecognize;
      const streamPauseMock: jest.Mock = streamingRecognizeMock.mock.results[0].value.pause;

      expect(isStreamPaused).toBe(true);
      expect(streamPauseMock).toHaveBeenCalled();
    });

    it('should return false if the stream does not exist', () => {
      const isStreamPaused = transcriptionService.pauseStream(roomId, userId);

      expect(isStreamPaused).toBe(false);
    });
  });

  describe('cleanStream', () => {
    it('there should be no the stream for that user in that room', () => {
      transcriptionService.addStream(roomId, userId, speaker);
      const isStreamCleaned = transcriptionService.cleanStream(roomId, userId);
      const stream = transcriptionService.getStream(roomId, userId);

      // As the mock has already been called I can access the streamingRecognize
      const streamingRecognizeMock: jest.Mock = speechClientMock.mock.results[0].value.streamingRecognize;
      const streamRemoveAllListenersMock: jest.Mock = streamingRecognizeMock.mock.results[0].value.removeAllListeners;
      const streamDestroyMock: jest.Mock = streamingRecognizeMock.mock.results[0].value.destroy;

      expect(isStreamCleaned).toBe(true);
      expect(stream).toBeUndefined();
      expect(streamRemoveAllListenersMock).toHaveBeenCalled();
      expect(streamDestroyMock).toHaveBeenCalled();
    });

    it('should return false if the stream does not exist', () => {
      const isStreamCleaned = transcriptionService.cleanStream(roomId, userId);

      expect(isStreamCleaned).toBe(false);
    });
  });

  describe('saveTranscript', () => {
    it('there should create a room <> transcript Map if there is none created', () => {
      transcriptionService.saveTranscript(roomId, transcript);
      const transcripts = transcriptionService['transcripts'];

      expect(transcripts?.get(roomId)?.length).toBe(1);
    });

    it('there should be more than one transcript if the room already exists', () => {
      transcriptionService.saveTranscript(roomId, transcript);
      transcriptionService.saveTranscript(roomId, transcript);
      const transcripts = transcriptionService['transcripts'];

      expect(transcripts?.get(roomId)?.length).toBe(2);
    });

    it('should always return true', () => {
      const savedTranscript = transcriptionService.saveTranscript(roomId, transcript);

      expect(savedTranscript).toBe(true);
    });
  });

  describe('popTranscripts', () => {
    it('there should remove the transcripts for the room', () => {
      transcriptionService.popTranscripts(roomId);
      const transcripts = transcriptionService['transcripts'];

      expect(transcripts?.get(roomId)).toBeUndefined();
    });

    it('it should return the transcripts for the room', () => {
      transcriptionService.saveTranscript(roomId, transcript);
      const trancripts = transcriptionService.popTranscripts(roomId);

      expect(trancripts).toBeDefined();
    });

    it('it should return undefined it there were no transcripts for the room', () => {
      const trancripts = transcriptionService.popTranscripts(roomId);

      expect(trancripts).toBeUndefined();
    });
  });
});
