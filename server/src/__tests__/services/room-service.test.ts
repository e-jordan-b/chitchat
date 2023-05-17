import RoomService from '../../services/room-service';

describe('RoomService', () => {
  let roomService: RoomService;
  let roomId = '123';
  let participantId = '456';
  let participantId2 = '789';
  let speaker = 'Adrian';

  beforeEach(() => {
    roomService = new RoomService();
  });

  describe('addRoom', () => {
    it('adds a room to the roomsMap', () => {
      const result = roomService.addRoom(roomId);

      expect(result).toBe(roomId);
      expect(roomService['roomsMap'].size).toBe(1);
      expect(roomService['roomsMap'].get(roomId)).toEqual({
        roomId,
        participants: [],
        status: 1, // IRoomStatus.PAUSED
      });
    });

    it('do not add a room that already exists in the roomsMap', () => {
      roomService.addRoom(roomId);
      const result = roomService.addRoom(roomId);

      expect(result).toBe(roomId);
      expect(roomService['roomsMap'].size).toBe(1);
    });
  });

  describe('addCallerToRoom', () => {
    it('adds a caller only if the room exists', () => {
      const result = roomService.addCallerToRoom(roomId, participantId, speaker);

      expect(result).toBe(false);
    });

    it('adds a participant to the room', () => {
      roomService.addRoom(roomId);
      const result = roomService.addCallerToRoom(roomId, participantId, speaker);

      expect(result).toBe(true);
      expect(roomService['roomsMap'].size).toBe(1);
      const participants = roomService['roomsMap'].get(roomId)?.participants;
      expect(participants?.length).toBe(1);
      if (participants) expect(participants[0]['speaker']).toEqual('Adrian');
    });

    it('caller can be added multiple times to the room', () => {
      roomService.addRoom(roomId);
      roomService.addCallerToRoom(roomId, participantId, speaker);
      roomService.addCallerToRoom(roomId, participantId, speaker);

      expect(roomService['roomsMap'].size).toBe(1);
      const participants = roomService['roomsMap'].get(roomId)?.participants;
      expect(participants?.length).toBe(2);
    });
  });

  describe('getCallersForRoom', () => {
    it('returns callers only if the room exists', () => {
      const result = roomService.getCallersForRoom(roomId);

      expect(result).toEqual([]);
    });

    it('returns the callers in the room', () => {
      roomService.addRoom(roomId);
      roomService.addCallerToRoom(roomId, participantId, speaker);
      const result = roomService.getCallersForRoom(roomId);

      const participants = roomService['roomsMap'].get(roomId)?.participants;
      if (participants) expect(result).toEqual(participants);
    });
  });

  describe('removeCallerFromRoom', () => {
    it('removes a caller only if the room exists', () => {
      const result = roomService.removeCallerFromRoom(roomId, participantId);

      expect(result).toBe(false);
    });

    it('removes a participant to the room', () => {
      roomService.addRoom(roomId);
      roomService.addCallerToRoom(roomId, participantId, speaker);
      roomService.addCallerToRoom(roomId, participantId2, speaker);
      const result = roomService.removeCallerFromRoom(roomId, participantId2);

      expect(result).toBe(true);
      expect(roomService['roomsMap'].size).toBe(1);
      const participants = roomService['roomsMap'].get(roomId)?.participants;
      expect(participants?.length).toBe(1);
      if (participants) expect(participants[0]['speaker']).toEqual('Adrian');
    });
  });

  describe('shouldResumeStream', () => {
    it('checks if there are more than one pariticipant only if the room exists', () => {
      const result = roomService.shouldResumeStream(roomId);

      expect(result).toBe(false);
    });

    it('checks if there are more than one pariticipant', () => {
      roomService.addRoom(roomId);
      roomService.addCallerToRoom(roomId, participantId, speaker);
      roomService.addCallerToRoom(roomId, participantId2, speaker);
      const result = roomService.shouldResumeStream(roomId);

      expect(result).toBe(true);
      expect(roomService['roomsMap'].size).toBe(1);
      const participants = roomService['roomsMap'].get(roomId)?.participants;
      expect(participants?.length).toBe(2);
    });
  });

  describe('shouldPauseStream', () => {
    it('pauses the stream if the room does not exist', () => {
      const result = roomService.shouldPauseStream(roomId);

      expect(result).toBe(true);
    });

    it('checks if there are less than one pariticipant', () => {
      roomService.addRoom(roomId);
      roomService.addCallerToRoom(roomId, participantId, speaker);
      const result = roomService.shouldPauseStream(roomId);

      expect(result).toBe(true);
      expect(roomService['roomsMap'].size).toBe(1);
      const participants = roomService['roomsMap'].get(roomId)?.participants;
      expect(participants?.length).toBe(1);
    });
  });
});
